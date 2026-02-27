import * as pty from 'node-pty';
import { ShellProfile, TerminalDimensions } from '@web-terminal/shared';

export interface PtyOptions {
  sessionId: string;
  profile: ShellProfile;
  dimensions: TerminalDimensions;
  onData: (data: string) => void;
  onExit: (exitCode: number) => void;
}

export class PtyProcess {
  private ptyProcess: pty.IPty | null = null;
  private sessionId: string;
  private profile: ShellProfile;

  constructor(options: PtyOptions) {
    this.sessionId = options.sessionId;
    this.profile = options.profile;

    console.log(`Spawning PTY: ${options.profile.path} ${options.profile.args.join(' ')} (${options.dimensions.cols}x${options.dimensions.rows})`);

    // Ensure dimensions are valid numbers
    const cols = Math.max(1, Math.floor(options.dimensions.cols) || 80);
    const rows = Math.max(1, Math.floor(options.dimensions.rows) || 24);

    try {
      this.ptyProcess = pty.spawn(options.profile.path, options.profile.args, {
        name: 'xterm-256color',
        cols,
        rows,
        cwd: process.env.HOME || process.cwd(),
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          COLORTERM: 'truecolor',
        },
      });
      console.log(`PTY spawned successfully for session ${options.sessionId}`);
    } catch (err) {
      console.error(`Failed to spawn PTY:`, err);
      throw err;
    }

    this.ptyProcess.onData(options.onData);
    this.ptyProcess.onExit(({ exitCode }) => {
      options.onExit(exitCode);
      this.ptyProcess = null;
    });
  }

  write(data: string): void {
    if (this.ptyProcess) {
      this.ptyProcess.write(data);
    }
  }

  resize(dimensions: TerminalDimensions): void {
    if (this.ptyProcess) {
      this.ptyProcess.resize(dimensions.cols, dimensions.rows);
    }
  }

  destroy(): void {
    if (this.ptyProcess) {
      this.ptyProcess.kill();
      this.ptyProcess = null;
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getProfile(): ShellProfile {
    return this.profile;
  }

  isAlive(): boolean {
    return this.ptyProcess !== null;
  }
}
