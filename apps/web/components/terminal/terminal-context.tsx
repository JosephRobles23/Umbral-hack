"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface TerminalSession {
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
}

interface TerminalContextValue {
  session: TerminalSession | null;
  launching: boolean;
  launch: (opts: { shell: string; edeId?: string; args?: string[] }) => Promise<void>;
  kill: () => Promise<void>;
}

const TerminalCtx = createContext<TerminalContextValue>({
  session: null,
  launching: false,
  launch: async () => {},
  kill: async () => {},
});

export function useTerminal() {
  return useContext(TerminalCtx);
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<TerminalSession | null>(null);
  const [launching, setLaunching] = useState(false);

  const launch = useCallback(async (opts: { shell: string; edeId?: string; args?: string[] }) => {
    setLaunching(true);
    try {
      const res = await fetch("/api/terminal/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edeId: opts.edeId || undefined,
          shell: opts.shell,
          args: opts.args ?? [],
        }),
      });
      const data = await res.json();
      setSession({
        sessionId: data.sessionId,
        wsPort: data.wsPort,
        config: data.config,
      });
    } finally {
      setLaunching(false);
    }
  }, []);

  const kill = useCallback(async () => {
    if (!session) return;
    try {
      await fetch(`/api/terminal/sessions/${session.sessionId}`, {
        method: "DELETE",
      });
    } catch {
      // session may already be gone
    }
    setSession(null);
  }, [session]);

  return (
    <TerminalCtx.Provider value={{ session, launching, launch, kill }}>
      {children}
    </TerminalCtx.Provider>
  );
}
