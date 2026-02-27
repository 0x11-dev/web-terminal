// WebSocket message types for terminal communication

export interface TerminalDimensions {
  cols: number;
  rows: number;
}

export interface ShellProfile {
  name: string;
  path: string;
  args: string[];
}

// Client -> Server messages
export type ClientMessageType =
  | 'create-session'
  | 'destroy-session'
  | 'input'
  | 'resize'
  | 'get-profiles'
  | 'set-profile';

export interface CreateSessionMessage {
  type: 'create-session';
  sessionId: string;
  profile?: ShellProfile;
  dimensions: TerminalDimensions;
}

export interface DestroySessionMessage {
  type: 'destroy-session';
  sessionId: string;
}

export interface InputMessage {
  type: 'input';
  sessionId: string;
  data: string;
}

export interface ResizeMessage {
  type: 'resize';
  sessionId: string;
  dimensions: TerminalDimensions;
}

export interface GetProfilesMessage {
  type: 'get-profiles';
}

export interface SetProfileMessage {
  type: 'set-profile';
  profile: ShellProfile;
}

export type ClientMessage =
  | CreateSessionMessage
  | DestroySessionMessage
  | InputMessage
  | ResizeMessage
  | GetProfilesMessage
  | SetProfileMessage;

// Server -> Client messages
export type ServerMessageType =
  | 'output'
  | 'session-created'
  | 'session-destroyed'
  | 'profiles-list'
  | 'profile-set'
  | 'error'
  | 'exit';

export interface OutputMessage {
  type: 'output';
  sessionId: string;
  data: string;
}

export interface SessionCreatedMessage {
  type: 'session-created';
  sessionId: string;
  profile: ShellProfile;
}

export interface SessionDestroyedMessage {
  type: 'session-destroyed';
  sessionId: string;
}

export interface ProfilesListMessage {
  type: 'profiles-list';
  profiles: ShellProfile[];
  defaultProfile: ShellProfile;
}

export interface ProfileSetMessage {
  type: 'profile-set';
  profile: ShellProfile;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
  sessionId?: string;
}

export interface ExitMessage {
  type: 'exit';
  sessionId: string;
  exitCode: number;
}

export type ServerMessage =
  | OutputMessage
  | SessionCreatedMessage
  | SessionDestroyedMessage
  | ProfilesListMessage
  | ProfileSetMessage
  | ErrorMessage
  | ExitMessage;
