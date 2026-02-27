import { useEffect, useRef, useCallback } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SearchAddon } from "@xterm/addon-search";
import { WebglAddon } from "@xterm/addon-webgl";
import { TerminalSession } from "../../store/terminalStore";
import { useTerminalStore } from "../../store/terminalStore";
import { getTerminalTheme } from "./TerminalTheme";
import "@xterm/xterm/css/xterm.css";

interface TerminalPaneProps {
  session: TerminalSession;
}

export function TerminalPane({ session }: TerminalPaneProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const { sendInput, resizeTerminal, activeSessionId } = useTerminalStore();

  const handleResize = useCallback(() => {
    if (fitAddonRef.current && xtermRef.current) {
      fitAddonRef.current.fit();
      const dims = fitAddonRef.current.proposeDimensions();
      if (dims) {
        resizeTerminal(session.id, { cols: dims.cols, rows: dims.rows });
      }
    }
  }, [session.id, resizeTerminal]);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const xterm = new XTerm({
      theme: getTerminalTheme(),
      // 字体设置 - 使用 JetBrains Mono，支持连字
      fontFamily:
        "'JetBrains Mono', 'SF Mono', 'Fira Code', 'Monaco', 'Menlo', monospace",
      fontSize: 13,
      fontWeight: "400",
      fontWeightBold: "500",
      lineHeight: 1.2,
      letterSpacing: 0,
      // 光标设置
      cursorBlink: true,
      cursorStyle: "bar",
      cursorWidth: 2,
      // 其他设置
      allowTransparency: true,
      scrollback: 50000,
      smoothScrollDuration: 100,
      // 性能优化
      fastScrollModifier: "shift",
      fastScrollSensitivity: 5,
      // 禁用选择时的高亮
      drawBoldTextInBrightColors: true,
      // 最小对比度，提高可读性
      minimumContrastRatio: 1,
    });

    // Addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddon = new SearchAddon();
    const webglAddon = new WebglAddon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);
    xterm.loadAddon(searchAddon);

    // Try to load WebGL addon (may fail on some browsers)
    try {
      xterm.loadAddon(webglAddon);
    } catch (e) {
      console.warn("WebGL addon not supported, falling back to canvas");
    }

    fitAddonRef.current = fitAddon;
    xtermRef.current = xterm;

    // Open terminal
    xterm.open(terminalRef.current);

    // Focus the terminal
    xterm.focus();

    // Initial fit
    setTimeout(() => {
      fitAddon.fit();
      const dims = fitAddon.proposeDimensions();
      if (dims) {
        resizeTerminal(session.id, { cols: dims.cols, rows: dims.rows });
      }
    }, 0);

    // Handle input
    xterm.onData((data) => {
      sendInput(session.id, data);
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      xterm.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [session.id, sendInput, resizeTerminal, handleResize]);

  // Handle output from server
  useEffect(() => {
    const handleOutput = (e: CustomEvent) => {
      if (e.detail.sessionId === session.id && xtermRef.current) {
        xtermRef.current.write(e.detail.data);
      }
    };

    window.addEventListener("terminal-output", handleOutput as EventListener);
    return () => {
      window.removeEventListener(
        "terminal-output",
        handleOutput as EventListener,
      );
    };
  }, [session.id]);

  // Focus terminal when this session becomes active
  useEffect(() => {
    if (activeSessionId === session.id && xtermRef.current) {
      // Small delay to ensure terminal is visible
      requestAnimationFrame(() => {
        xtermRef.current?.focus();
      });
    }
  }, [activeSessionId, session.id]);

  return (
    <div ref={terminalRef} className="terminal-container h-full w-full py-0" />
  );
}
