"use client";

interface TerminalBarProps {
  sessionId: string;
  status: "connecting" | "connected" | "disconnected";
  onKill: () => void;
}

export function TerminalBar({ sessionId, status, onKill }: TerminalBarProps) {
  const statusColor =
    status === "connected"
      ? "bg-[#66C45A]"
      : status === "connecting"
        ? "bg-[#F3BC4F]"
        : "bg-[#EC5B56]";

  const statusTextColor =
    status === "connected"
      ? "text-[#66C45A]"
      : status === "connecting"
        ? "text-[#F3BC4F]"
        : "text-[#EC5B56]";

  return (
    <div className="h-9 bg-term-surface border-b border-term-border px-3.5 flex items-center justify-between font-mono text-[11px] text-term-text">
      <div className="flex items-center gap-2">
        {/* Traffic lights */}
        <div className="flex gap-2">
          <span
            className="w-3 h-3 rounded-full bg-[#EC5B56] border border-black/30 cursor-pointer hover:brightness-110"
            onClick={onKill}
            title="Kill session"
          />
          <span className="w-3 h-3 rounded-full bg-[#F3BC4F] border border-black/30" />
          <span className="w-3 h-3 rounded-full bg-[#66C45A] border border-black/30" />
        </div>
        <span className="opacity-60">
          session: {sessionId.slice(0, 8)}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
        <span className={`text-[10px] ${statusTextColor}`}>{status}</span>
      </div>
    </div>
  );
}
