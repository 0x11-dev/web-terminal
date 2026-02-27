import express from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import { SessionManager } from './pty';
import { ProfileService, detectAvailableShells, getDefaultShell } from './profiles';
import { WebSocketHandler } from './ws';

const PORT = process.env.PORT || 3000;

// Create Express app with WebSocket support
const app = express();
const wsInstance = expressWs(app);

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
app.ws('/ws', (ws: WebSocket) => {
  wsHandler.handleConnection(ws);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  sessionManager.destroyAll();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  sessionManager.destroyAll();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available shells:');
  const shells = detectAvailableShells();
  shells.forEach((shell) => {
    console.log(`  - ${shell.name}: ${shell.path}`);
  });
  console.log(`Default shell: ${getDefaultShell().name}`);
});

export { app, sessionManager, profileService };
