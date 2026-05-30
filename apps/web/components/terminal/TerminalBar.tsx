"use client";

interface TerminalBarProps {
  sessionId: string;
  status: "connecting" | "connected" | "disconnected";
  onKill: () => void;
}

export function TerminalBar({ sessionId, status, onKill }: TerminalBarProps) {
  const statusColor =
    status === "connected" ? "#66c45a" : status === "connecting" ? "#f3bc4f" : "#ec5b56";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 14px",
        background: "linear-gradient(180deg, #1a1812 0%, #14110b 100%)",
        borderBottom: "1px solid rgba(243, 169, 59, 0.18)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#ec5b56",
              border: "1px solid rgba(0,0,0,0.4)",
              display: "inline-block",
              cursor: "pointer",
            }}
            onClick={onKill}
            title="Kill session"
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#f3bc4f",
              border: "1px solid rgba(0,0,0,0.4)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#66c45a",
              border: "1px solid rgba(0,0,0,0.4)",
              display: "inline-block",
            }}
          />
        </div>
        <span style={{ color: "#e6dfc8", opacity: 0.7 }}>
          session: {sessionId.slice(0, 8)}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: statusColor,
            display: "inline-block",
          }}
        />
        <span style={{ color: statusColor, fontSize: 10 }}>{status}</span>
      </div>
    </div>
  );
}
