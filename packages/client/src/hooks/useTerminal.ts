import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useTerminalStore } from '../store/terminalStore';

export function useTerminal(sessionId: string) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const { sendInput, resizeTerminal } = useTerminalStore();

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Terminal initialization is handled in TerminalPane component
    // This hook is for additional terminal operations

    return () => {
      // Cleanup is handled by the component
    };
  }, [sessionId]);

  const focus = () => {
    xtermRef.current?.focus();
  };

  const clear = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  const resize = () => {
    if (fitAddonRef.current) {
      fitAddonRef.current.fit();
    }
  };

  return {
    terminalRef,
    xtermRef,
    fitAddonRef,
    focus,
    clear,
    resize,
  };
}
