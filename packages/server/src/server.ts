import express from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import path from 'path';
import { SessionManager } from './pty';
import { ProfileService, detectAvailableShells, getDefaultShell } from './profiles';
import { WebSocketHandler } from './ws';

export interface ServerOptions {
  port?: number;
  open?: boolean;
}

export interface ServerInstance {
  close: () => void;
  port: number;
}

export function createServer(options: ServerOptions = {}): Promise<ServerInstance> {
  return new Promise((resolve, reject) => {
    const port = options.port || parseInt(process.env.PORT || '3000', 10);
    const isProduction = process.env.NODE_ENV === 'production';

    // Create Express app with WebSocket support
    const app = express();
    const wsApp = expressWs(app).app;

    // Middleware
    app.use(express.json());

    // CORS for development
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });

    // Initialize services
    const sessionManager = new SessionManager();
    const profileService = new ProfileService();
    const wsHandler = new WebSocketHandler(sessionManager, profileService);

    // REST endpoints
    app.get('/api/profiles', (req, res) => {
      res.json({
        profiles: profileService.getProfiles(),
        defaultProfile: profileService.getDefaultProfile(),
      });
    });

    app.post('/api/profiles/default', (req, res) => {
      try {
        profileService.setDefaultProfile(req.body);
        res.json({ success: true, profile: req.body });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    });

    // WebSocket endpoint
    (wsApp as any).ws('/ws', (ws: WebSocket) => {
      wsHandler.handleConnection(ws);
    });

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Serve static files - try multiple possible locations
    const clientPaths = [
      path.join(__dirname, '../../client/dist'),  // monorepo structure
      path.join(__dirname, '../client'),          // bundled structure
    ];

    let clientPath = '';
    for (const p of clientPaths) {
      try {
        if (require('fs').existsSync(path.join(p, 'index.html'))) {
          clientPath = p;
          break;
        }
      } catch {}
    }

    if (clientPath) {
      app.use(express.static(clientPath));

      // SPA fallback
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/ws') || req.path.startsWith('/health')) {
          return next();
        }
        res.sendFile(path.join(clientPath, 'index.html'));
      });
    }

    // Graceful shutdown helpers
    const shutdown = () => {
      sessionManager.destroyAll();
      server.close();
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    const server = app.listen(port, () => {
      console.log(`\n  🌐 Web Terminal running at http://localhost:${port}`);
      console.log('\n  Available shells:');
      const shells = detectAvailableShells();
      shells.forEach((shell) => {
        console.log(`    - ${shell.name}: ${shell.path}`);
      });
      console.log(`  Default shell: ${getDefaultShell().name}`);
      console.log('\n  Press Ctrl+C to stop\n');

      resolve({
        close: shutdown,
        port,
      });
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is already in use`));
      } else {
        reject(err);
      }
    });
  });
}
