import { create } from "zustand";
import {
  ShellProfile,
  ServerMessage,
  ClientMessage,
  TerminalDimensions,
} from "@web-terminal/shared";

export interface TerminalSession {
  id: string;
  name: string;
  profile: ShellProfile;
  exitCode?: number;
}

interface TerminalState {
  // Sessions
  sessions: TerminalSession[];
  activeSessionId: string | null;

  // Profiles
  profiles: ShellProfile[];
  defaultProfile: ShellProfile | null;

  // Connection
  isConnected: boolean;
  ws: WebSocket | null;

  // Actions
  initialize: () => void;
  cleanup: () => void;

  // Session management
  createSession: () => void;
  destroySession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
  renameSession: (sessionId: string, name: string) => void;

  // Terminal operations
  sendInput: (sessionId: string, data: string) => void;
  resizeTerminal: (sessionId: string, dimensions: TerminalDimensions) => void;

  // Profile management
  setDefaultProfile: (profile: ShellProfile) => void;

  // Internal
  _handleServerMessage: (message: ServerMessage) => void;
  _sendMessage: (message: ClientMessage) => void;
}

let sessionIdCounter = 0;

const generateSessionId = () => {
  sessionIdCounter++;
  return `session-${Date.now()}-${sessionIdCounter}`;
};

const generateSessionName = (profileName: string) => {
  return `${profileName} - ${new Date().toLocaleTimeString()}`;
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  // Initial state
  sessions: [],
  activeSessionId: null,
  profiles: [],
  defaultProfile: null,
  isConnected: false,
  ws: null,

  initialize: () => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      set({ isConnected: true, ws });
      // Request profiles
      get()._sendMessage({ type: "get-profiles" });
    };

    ws.onclose = () => {
      set({ isConnected: false, ws: null });
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data);
        get()._handleServerMessage(message);
      } catch (error) {
        console.error("Failed to parse server message:", error);
      }
    };
  },

  cleanup: () => {
    const { ws, sessions } = get();
    if (ws) {
      // Destroy all sessions
      sessions.forEach((session) => {
        ws.send(
          JSON.stringify({ type: "destroy-session", sessionId: session.id }),
        );
      });
      ws.close();
    }
    set({ ws: null, sessions: [], activeSessionId: null, isConnected: false });
  },

  createSession: () => {
    const { defaultProfile, profiles, sessions } = get();
    const profile = defaultProfile || profiles[0];

    console.log(
      "[Store] createSession called, profile:",
      profile,
      "profiles:",
      profiles,
    );

    if (!profile) {
      console.error("No shell profile available");
      return;
    }

    const sessionId = generateSessionId();
    const sessionName = generateSessionName(profile.name);

    // Create the session in store first
    const newSession: TerminalSession = {
      id: sessionId,
      name: sessionName,
      profile,
    };

    set({
      sessions: [...sessions, newSession],
      activeSessionId: sessionId,
    });

    const message = {
      type: "create-session" as const,
      sessionId,
      profile,
      dimensions: { cols: 80, rows: 24 },
    };
    console.log("[Store] Sending create-session message:", message);
    get()._sendMessage(message);
  },

  destroySession: (sessionId: string) => {
    const { sessions, activeSessionId } = get();

    get()._sendMessage({ type: "destroy-session", sessionId });

    const newSessions = sessions.filter((s) => s.id !== sessionId);
    let newActiveId = activeSessionId;

    if (activeSessionId === sessionId) {
      newActiveId =
        newSessions.length > 0 ? newSessions[newSessions.length - 1].id : null;
    }

    set({ sessions: newSessions, activeSessionId: newActiveId });
  },

  setActiveSession: (sessionId: string) => {
    set({ activeSessionId: sessionId });
  },

  renameSession: (sessionId: string, name: string) => {
    const { sessions } = get();
    set({
      sessions: sessions.map((s) => (s.id === sessionId ? { ...s, name } : s)),
    });
  },

  sendInput: (sessionId: string, data: string) => {
    get()._sendMessage({ type: "input", sessionId, data });
  },

  resizeTerminal: (sessionId: string, dimensions: TerminalDimensions) => {
    get()._sendMessage({ type: "resize", sessionId, dimensions });
  },

  setDefaultProfile: (profile: ShellProfile) => {
    get()._sendMessage({ type: "set-profile", profile });
    set({ defaultProfile: profile });
  },

  _handleServerMessage: (message: ServerMessage) => {
    // console.log('[WS] Received message:', message);
    const { sessions, activeSessionId } = get();

    switch (message.type) {
      case "profiles-list":
        set({
          profiles: message.profiles,
          defaultProfile: message.defaultProfile,
        });
        break;

      case "session-created":
        // Session already added locally, just confirm
        break;

      case "session-destroyed":
        // Session already removed locally
        break;

      case "output":
        // Emit to terminal component via custom event
        window.dispatchEvent(
          new CustomEvent("terminal-output", {
            detail: { sessionId: message.sessionId, data: message.data },
          }),
        );
        break;

      case "exit":
        set({
          sessions: sessions.map((s) =>
            s.id === message.sessionId
              ? { ...s, exitCode: message.exitCode }
              : s,
          ),
        });
        break;

      case "profile-set":
        set({ defaultProfile: message.profile });
        break;

      case "error":
        console.error("Server error:", message.message);
        break;
    }
  },

  _sendMessage: (message: ClientMessage) => {
    const { ws, isConnected } = get();
    if (ws && isConnected) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  },
}));
