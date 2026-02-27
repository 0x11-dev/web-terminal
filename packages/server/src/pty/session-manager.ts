import { PtyProcess, PtyOptions } from './pty-process';
import { ShellProfile, TerminalDimensions } from '@web-terminal/shared';

export class SessionManager {
  private sessions: Map<string, PtyProcess> = new Map();

  createSession(
    sessionId: string,
    profile: ShellProfile,
    dimensions: TerminalDimensions,
    onData: (data: string) => void,
    onExit: (exitCode: number) => void
  ): PtyProcess {
    if (this.sessions.has(sessionId)) {
      throw new Error(`Session ${sessionId} already exists`);
    }

    const ptyProcess = new PtyProcess({
      sessionId,
      profile,
      dimensions,
      onData,
      onExit: (exitCode) => {
        this.sessions.delete(sessionId);
        onExit(exitCode);
      },
    });

    this.sessions.set(sessionId, ptyProcess);
    return ptyProcess;
  }

  getSession(sessionId: string): PtyProcess | undefined {
    return this.sessions.get(sessionId);
  }

  destroySession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.destroy();
      this.sessions.delete(sessionId);
    }
  }

  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  getAllSessions(): string[] {
    return Array.from(this.sessions.keys());
  }

  destroyAll(): void {
    for (const [sessionId] of this.sessions) {
      this.destroySession(sessionId);
    }
  }
}
