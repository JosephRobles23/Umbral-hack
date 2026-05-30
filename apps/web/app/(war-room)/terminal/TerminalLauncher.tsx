"use client";

import { useState } from "react";
import type { Ede } from "@umbral/contracts";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

interface TerminalLauncherProps {
  edes: Ede[];
}

interface ActiveSession {
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

export function TerminalLauncher({ edes }: TerminalLauncherProps) {
  const [selectedEde, setSelectedEde] = useState<string>("");
  const [shell, setShell] = useState<string>("claude");
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(false);

  async function launch() {
    setLoading(true);
    try {
      const res = await fetch("/api/terminal/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edeId: selectedEde || undefined,
          shell,
          args: [],
        }),
      });
      const data = await res.json();
      setSession({
        sessionId: data.sessionId,
        wsPort: data.wsPort,
        config: data.config,
      });
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return (
      <div style={{ height: "calc(100vh - 160px)" }}>
        <TerminalPanel
          sessionId={session.sessionId}
          wsPort={session.wsPort}
          config={session.config}
          onKill={() => {
            fetch(`/api/terminal/sessions/${session.sessionId}`, {
              method: "DELETE",
            });
            setSession(null);
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #262626",
        borderRadius: 8,
        padding: 24,
        backgroundColor: "#0a0a0a",
        maxWidth: 480,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, margin: 0 }}>
        Launch Terminal
      </h2>

      <div style={{ marginBottom: 12 }}>
        <label
          style={{ display: "block", fontSize: 12, color: "#737373", marginBottom: 4 }}
        >
          Shell
        </label>
        <select
          value={shell}
          onChange={(e) => setShell(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: "#171717",
            border: "1px solid #333",
            borderRadius: 4,
            color: "#e5e5e5",
            fontSize: 13,
            fontFamily: "monospace",
          }}
        >
          <option value="claude">Claude Code (claude)</option>
          <option value="powershell.exe">PowerShell</option>
          <option value="cmd.exe">CMD</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", fontSize: 12, color: "#737373", marginBottom: 4 }}
        >
          EDE Context (optional)
        </label>
        <select
          value={selectedEde}
          onChange={(e) => setSelectedEde(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: "#171717",
            border: "1px solid #333",
            borderRadius: 4,
            color: "#e5e5e5",
            fontSize: 13,
            fontFamily: "monospace",
          }}
        >
          <option value="">All EDEs (generates CLAUDE.md with all)</option>
          {edes.map((ede) => (
            <option key={ede.id} value={ede.id}>
              {ede.id}: {ede.title}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={launch}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          backgroundColor: loading ? "#333" : "#f3a93b",
          color: "#0d0c08",
          border: "none",
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "monospace",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Starting..." : "Launch Terminal"}
      </button>
    </div>
  );
}
