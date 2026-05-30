"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TerminalBar } from "./TerminalBar";

interface TerminalPanelProps {
  sessionId: string;
  wsPort: number;
  config: {
    shell: string;
    args: string[];
    cols: number;
    rows: number;
    env: Record<string, string>;
    cwd: string;
  };
  onKill?: () => void;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function TerminalPanel({ sessionId, wsPort, config, onKill }: TerminalPanelProps) {
  const termRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const termInstanceRef = useRef<unknown>(null);
  const fitAddonRef = useRef<unknown>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const handleKill = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: "detach" }));
      wsRef.current.close();
    }
    onKill?.();
  }, [onKill]);

  useEffect(() => {
    if (!termRef.current) return;

    let disposed = false;

    async function init() {
      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      const { WebLinksAddon } = await import("@xterm/addon-web-links");

      // @ts-expect-error CSS module import handled by Next.js bundler
      await import("@xterm/xterm/css/xterm.css");

      if (disposed) return;

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      const term = new Terminal({
        theme: {
          background: "#0d0c08",
          foreground: "#e6dfc8",
          cursor: "#f3a93b",
          cursorAccent: "#0d0c08",
          selectionBackground: "rgba(243, 169, 59, 0.28)",
          black: "#1c1a14",
          red: "#ec5b56",
          green: "#66c45a",
          yellow: "#f3bc4f",
          blue: "#6366f1",
          magenta: "#a78bfa",
          cyan: "#22d3ee",
          white: "#e6dfc8",
          brightBlack: "#4a4536",
          brightRed: "#ff9a76",
          brightGreen: "#a4d8a4",
          brightYellow: "#f3a93b",
          brightBlue: "#818cf8",
          brightMagenta: "#c4b5fd",
          brightCyan: "#67e8f9",
          brightWhite: "#f4efe2",
        },
        fontFamily: "'IBM Plex Mono', 'Cascadia Code', monospace",
        fontSize: 13,
        cursorBlink: true,
        allowProposedApi: true,
      });

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(termRef.current!);
      fitAddon.fit();

      termInstanceRef.current = term;
      fitAddonRef.current = fitAddon;

      const ws = new WebSocket(`ws://127.0.0.1:${wsPort}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        ws.send(
          JSON.stringify({
            type: "attach",
            sessionId,
            config,
          }),
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.type === "output") {
            term.write(msg.data);
          } else if (msg.type === "session-ended") {
            setStatus("disconnected");
            term.write("\r\n\x1b[33m[Session ended]\x1b[0m\r\n");
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        setStatus("disconnected");
      };

      ws.onerror = () => {
        setStatus("disconnected");
      };

      term.onData((data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "input", data }));
        }
      });

      const observer = new ResizeObserver(() => {
        fitAddon.fit();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "resize",
              cols: term.cols,
              rows: term.rows,
            }),
          );
        }
      });

      observer.observe(termRef.current!);

      return () => {
        observer.disconnect();
        ws.close();
        term.dispose();
      };
    }

    const cleanup = init();

    return () => {
      disposed = true;
      cleanup.then((fn) => fn?.());
    };
  }, [sessionId, wsPort, config]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #262626",
        height: "100%",
        minHeight: 400,
      }}
    >
      <TerminalBar sessionId={sessionId} status={status} onKill={handleKill} />
      <div
        ref={termRef}
        style={{
          flex: 1,
          backgroundColor: "#0d0c08",
          padding: 4,
          position: "relative",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
