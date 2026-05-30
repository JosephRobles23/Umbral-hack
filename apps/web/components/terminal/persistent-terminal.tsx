"use client";

import { usePathname } from "next/navigation";
import { useTerminal } from "./terminal-context";
import { TerminalPanel } from "./TerminalPanel";

export function PersistentTerminal() {
  const { session, kill } = useTerminal();
  const pathname = usePathname();

  if (!session) return null;

  const visible = pathname === "/terminal";

  return (
    <div
      className={`absolute inset-0 z-10 bg-term-bg ${visible ? "" : "invisible pointer-events-none"}`}
      aria-hidden={!visible}
    >
      <div className="h-full p-8">
        <div className="h-full">
          <TerminalPanel
            sessionId={session.sessionId}
            wsPort={session.wsPort}
            config={session.config}
            onKill={kill}
          />
        </div>
      </div>
    </div>
  );
}
