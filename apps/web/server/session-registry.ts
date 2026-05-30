import type { IPty } from "node-pty";
import type WebSocket from "ws";
import type { TerminalConfig } from "@umbral/contracts";
import { spawnPty, killPty } from "./pty-manager";

const GRACE_MS = 5 * 60 * 1000;
const BUFFER_SIZE = 64 * 1024;

interface Session {
  id: string;
  pty: IPty;
  clients: Set<WebSocket>;
  graceTimer: ReturnType<typeof setTimeout> | null;
  buffer: string;
  pid: number;
  config: TerminalConfig;
}

const sessions = new Map<string, Session>();

export function createSession(id: string, config: TerminalConfig): Session {
  const p = spawnPty(config);

  const session: Session = {
    id,
    pty: p,
    clients: new Set(),
    graceTimer: null,
    buffer: "",
    pid: p.pid,
    config,
  };

  p.onData((data: string) => {
    session.buffer += data;
    if (session.buffer.length > BUFFER_SIZE) {
      session.buffer = session.buffer.slice(-BUFFER_SIZE);
    }
    for (const ws of session.clients) {
      ws.send(JSON.stringify({ type: "output", data }));
    }
  });

  p.onExit(({ exitCode }) => {
    for (const ws of session.clients) {
      ws.send(JSON.stringify({ type: "session-ended", sessionId: id, exitCode }));
    }
    sessions.delete(id);
  });

  sessions.set(id, session);
  return session;
}

export function attachClient(sessionId: string, ws: WebSocket): Session | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.graceTimer) {
    clearTimeout(session.graceTimer);
    session.graceTimer = null;
  }

  session.clients.add(ws);

  if (session.buffer.length > 0) {
    ws.send(JSON.stringify({ type: "output", data: session.buffer }));
  }

  return session;
}

export function detachClient(sessionId: string, ws: WebSocket): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.clients.delete(ws);

  if (session.clients.size === 0) {
    session.graceTimer = setTimeout(() => {
      killSession(sessionId);
    }, GRACE_MS);
  }
}

export function killSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  if (session.graceTimer) {
    clearTimeout(session.graceTimer);
  }

  killPty(session.pty);
  sessions.delete(sessionId);
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId);
}

export function getActiveSessions(): { id: string; pid: number }[] {
  return Array.from(sessions.values()).map((s) => ({ id: s.id, pid: s.pid }));
}
