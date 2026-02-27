export interface Keybinding {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: string;
  description: string;
}

export const DEFAULT_KEYBINDINGS: Keybinding[] = [
  // Tab management
  {
    key: 't',
    ctrl: true,
    shift: true,
    action: 'newTab',
    description: 'New Tab',
  },
  {
    key: 'w',
    ctrl: true,
    shift: true,
    action: 'closeTab',
    description: 'Close Current Tab',
  },
  {
    key: 'Tab',
    ctrl: true,
    action: 'nextTab',
    description: 'Next Tab',
  },
  {
    key: 'Tab',
    ctrl: true,
    shift: true,
    action: 'previousTab',
    description: 'Previous Tab',
  },

  // Terminal operations
  {
    key: 'c',
    ctrl: true,
    shift: true,
    action: 'copy',
    description: 'Copy Selection',
  },
  {
    key: 'v',
    ctrl: true,
    shift: true,
    action: 'paste',
    description: 'Paste from Clipboard',
  },
  {
    key: 'l',
    ctrl: true,
    action: 'clearTerminal',
    description: 'Clear Terminal',
  },

  // Profile
  {
    key: 'p',
    ctrl: true,
    shift: true,
    action: 'selectProfile',
    description: 'Select Profile',
  },
];

export function formatKeybinding(kb: Keybinding): string {
  const parts: string[] = [];
  if (kb.ctrl) parts.push('Ctrl');
  if (kb.shift) parts.push('Shift');
  if (kb.alt) parts.push('Alt');
  if (kb.meta) parts.push('Cmd');
  parts.push(kb.key.length === 1 ? kb.key.toUpperCase() : kb.key);
  return parts.join('+');
}
