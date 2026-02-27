import { WebSocket } from 'ws';
import {
  ClientMessage,
  ServerMessage,
  ShellProfile,
} from '@web-terminal/shared';
import { SessionManager } from '../pty';
import { ProfileService } from '../profiles';

export class WebSocketHandler {
  private sessionManager: SessionManager;
  private profileService: ProfileService;

  constructor(sessionManager: SessionManager, profileService: ProfileService) {
    this.sessionManager = sessionManager;
    this.profileService = profileService;
  }

  handleConnection(ws: WebSocket): void {
    console.log('New WebSocket connection');

    ws.on('message', (data: Buffer) => {
      try {
        const message: ClientMessage = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        console.error('Failed to parse message:', error);
        this.sendMessage(ws, {
          type: 'error',
          message: 'Invalid message format',
        });
      }
    });

    ws.on('close', () => {
      console.log('WebSocket closed, cleaning up sessions');
      // Clean up all sessions for this connection
      const sessions = this.sessionManager.getAllSessions();
      for (const sessionId of sessions) {
        this.sessionManager.destroySession(sessionId);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private sendMessage(ws: WebSocket, message: ServerMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(ws: WebSocket, message: ClientMessage): void {
    switch (message.type) {
      case 'create-session':
        this.handleCreateSession(ws, message);
        break;
      case 'destroy-session':
        this.handleDestroySession(ws, message);
        break;
      case 'input':
        this.handleInput(ws, message);
        break;
      case 'resize':
        this.handleResize(ws, message);
        break;
      case 'get-profiles':
        this.handleGetProfiles(ws);
        break;
      case 'set-profile':
        this.handleSetProfile(ws, message);
        break;
      default:
        this.sendMessage(ws, {
          type: 'error',
          message: `Unknown message type: ${(message as any).type}`,
        });
    }
  }

  private handleCreateSession(
    ws: WebSocket,
    message: { sessionId: string; profile?: ShellProfile; dimensions: { cols: number; rows: number } }
  ): void {
    try {
      const profile = message.profile || this.profileService.getDefaultProfile();

      this.sessionManager.createSession(
        message.sessionId,
        profile,
        message.dimensions,
        (data: string) => {
          this.sendMessage(ws, {
            type: 'output',
            sessionId: message.sessionId,
            data,
          });
        },
        (exitCode: number) => {
          this.sendMessage(ws, {
            type: 'exit',
            sessionId: message.sessionId,
            exitCode,
          });
        }
      );

      this.sendMessage(ws, {
        type: 'session-created',
        sessionId: message.sessionId,
        profile,
      });
    } catch (error: any) {
      this.sendMessage(ws, {
        type: 'error',
        message: error.message,
        sessionId: message.sessionId,
      });
    }
  }

  private handleDestroySession(
    ws: WebSocket,
    message: { sessionId: string }
  ): void {
    this.sessionManager.destroySession(message.sessionId);
    this.sendMessage(ws, {
      type: 'session-destroyed',
      sessionId: message.sessionId,
    });
  }

  private handleInput(
    ws: WebSocket,
    message: { sessionId: string; data: string }
  ): void {
    const session = this.sessionManager.getSession(message.sessionId);
    if (session) {
      session.write(message.data);
    } else {
      this.sendMessage(ws, {
        type: 'error',
        message: `Session ${message.sessionId} not found`,
        sessionId: message.sessionId,
      });
    }
  }

  private handleResize(
    ws: WebSocket,
    message: { sessionId: string; dimensions: { cols: number; rows: number } }
  ): void {
    const session = this.sessionManager.getSession(message.sessionId);
    if (session) {
      session.resize(message.dimensions);
    }
  }

  private handleGetProfiles(ws: WebSocket): void {
    this.sendMessage(ws, {
      type: 'profiles-list',
      profiles: this.profileService.getProfiles(),
      defaultProfile: this.profileService.getDefaultProfile(),
    });
  }

  private handleSetProfile(
    ws: WebSocket,
    message: { profile: ShellProfile }
  ): void {
    try {
      this.profileService.setDefaultProfile(message.profile);
      this.sendMessage(ws, {
        type: 'profile-set',
        profile: message.profile,
      });
    } catch (error: any) {
      this.sendMessage(ws, {
        type: 'error',
        message: error.message,
      });
    }
  }
}
