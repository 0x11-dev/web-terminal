import { Keybinding, DEFAULT_KEYBINDINGS } from './defaults';
import { useTerminalStore } from '../store/terminalStore';

export class KeybindingsManager {
  private keybindings: Keybinding[];
  private boundHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.keybindings = [...DEFAULT_KEYBINDINGS];
    this.boundHandler = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.boundHandler);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.boundHandler);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const matchedBinding = this.findMatchingKeybinding(e);
    if (matchedBinding) {
      e.preventDefault();
      e.stopPropagation();
      this.executeAction(matchedBinding.action);
    }
  }

  private findMatchingKeybinding(e: KeyboardEvent): Keybinding | undefined {
    return this.keybindings.find((kb) => {
      return (
        kb.key.toLowerCase() === e.key.toLowerCase() &&
        !!kb.ctrl === e.ctrlKey &&
        !!kb.shift === e.shiftKey &&
        !!kb.alt === e.altKey &&
        !!kb.meta === e.metaKey
      );
    });
  }

  private executeAction(action: string): void {
    const store = useTerminalStore.getState();

    switch (action) {
      case 'newTab':
        store.createSession();
        break;

      case 'closeTab':
        if (store.activeSessionId) {
          store.destroySession(store.activeSessionId);
        }
        break;

      case 'nextTab': {
        const sessions = store.sessions;
        const activeId = store.activeSessionId;
        if (sessions.length > 1 && activeId) {
          const currentIndex = sessions.findIndex((s) => s.id === activeId);
          const nextIndex = (currentIndex + 1) % sessions.length;
          store.setActiveSession(sessions[nextIndex].id);
        }
        break;
      }

      case 'previousTab': {
        const sessions = store.sessions;
        const activeId = store.activeSessionId;
        if (sessions.length > 1 && activeId) {
          const currentIndex = sessions.findIndex((s) => s.id === activeId);
          const prevIndex = (currentIndex - 1 + sessions.length) % sessions.length;
          store.setActiveSession(sessions[prevIndex].id);
        }
        break;
      }

      case 'copy':
        document.execCommand('copy');
        break;

      case 'paste':
        navigator.clipboard.readText().then((text) => {
          if (store.activeSessionId) {
            store.sendInput(store.activeSessionId, text);
          }
        });
        break;

      case 'clearTerminal':
        if (store.activeSessionId) {
          store.sendInput(store.activeSessionId, '\x1b[2J\x1b[H');
        }
        break;

      case 'selectProfile':
        // Toggle profile selector dropdown
        const profileButton = document.querySelector('[title="Select Shell Profile"]') as HTMLButtonElement;
        if (profileButton) {
          profileButton.click();
        }
        break;
    }
  }

  addKeybinding(kb: Keybinding): void {
    // Remove existing binding for the same action
    this.keybindings = this.keybindings.filter((k) => k.action !== kb.action);
    this.keybindings.push(kb);
  }

  removeKeybinding(action: string): void {
    this.keybindings = this.keybindings.filter((k) => k.action !== action);
  }

  getKeybindings(): Keybinding[] {
    return [...this.keybindings];
  }
}
