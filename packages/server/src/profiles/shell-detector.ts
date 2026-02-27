import { ShellProfile } from '@web-terminal/shared';
import * as fs from 'fs';

// Common shell paths and their configurations
const SHELL_PATTERNS: Array<{ name: string; paths: string[]; args: string[] }> = [
  { name: 'zsh', paths: ['/bin/zsh', '/usr/bin/zsh'], args: ['-l'] },
  { name: 'bash', paths: ['/bin/bash', '/usr/bin/bash'], args: ['-l'] },
  { name: 'fish', paths: ['/usr/local/bin/fish', '/opt/homebrew/bin/fish', '/bin/fish'], args: ['-l'] },
  { name: 'sh', paths: ['/bin/sh', '/usr/bin/sh'], args: [] },
];

export function detectAvailableShells(): ShellProfile[] {
  const availableShells: ShellProfile[] = [];

  for (const pattern of SHELL_PATTERNS) {
    for (const shellPath of pattern.paths) {
      if (fs.existsSync(shellPath)) {
        // Check if already added
        if (!availableShells.find(s => s.name === pattern.name)) {
          availableShells.push({
            name: pattern.name,
            path: shellPath,
            args: [...pattern.args],
          });
        }
        break;
      }
    }
  }

  return availableShells;
}

export function getDefaultShell(): ShellProfile {
  // First try to get the user's default shell from environment
  const envShell = process.env.SHELL;
  if (envShell) {
    const shellName = envShell.split('/').pop() || 'sh';
    const detected = detectAvailableShells();
    const found = detected.find(s => s.path === envShell || s.name === shellName);
    if (found) {
      return found;
    }
  }

  // Fallback to first available shell
  const shells = detectAvailableShells();
  if (shells.length > 0) {
    return shells[0];
  }

  // Ultimate fallback
  return { name: 'sh', path: '/bin/sh', args: [] };
}
