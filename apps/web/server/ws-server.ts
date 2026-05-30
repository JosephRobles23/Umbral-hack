import { WebSocketServer, WebSocket } from "ws";
import { createSession, attachClient, detachClient, killSession, getSession } from "./session-registry";
import type { TerminalConfig } from "@umbral/contracts";

const PORT = Number(process.env.UMBRAL_WS_PORT ?? 3099);

const wss = new WebSocketServer({ host: "127.0.0.1", port: PORT });

console.log(`[umbral-ws] Terminal WebSocket server on ws://127.0.0.1:${PORT}`);

interface AttachMessage {
  type: "attach";
  sessionId: string;
  config?: TerminalConfig;
}

interface InputMessage {
  type: "input";
  data: string;
}

interface ResizeMessage {
  type: "resize";
  cols: number;
  rows: number;
}

interface DetachMessage {
  type: "detach";
}

type ClientMessage = AttachMessage | InputMessage | ResizeMessage | DetachMessage;

wss.on("connection", (ws: WebSocket) => {
  let currentSessionId: string | null = null;

  ws.on("message", (raw: Buffer) => {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    switch (msg.type) {
      case "attach": {
        currentSessionId = msg.sessionId;

        const existing = attachClient(msg.sessionId, ws);
        if (existing) {
          ws.send(
            JSON.stringify({
              type: "session-created",
              sessionId: msg.sessionId,
              pid: existing.pid,
            }),
          );
          break;
        }

        const config: TerminalConfig = msg.config ?? {
          shell: "",
          args: [],
          cols: 80,
          rows: 24,
          env: {},
          cwd: process.cwd(),
        };

        const session = createSession(msg.sessionId, config);
        session.clients.add(ws);

        ws.send(
          JSON.stringify({
            type: "session-created",
            sessionId: msg.sessionId,
            pid: session.pid,
          }),
        );
        break;
      }

      case "input": {
        if (!currentSessionId) break;
        const s = getSession(currentSessionId);
        if (s) s.pty.write(msg.data);
        break;
      }

      case "resize": {
        if (!currentSessionId) break;
        const sess = getSession(currentSessionId);
        if (sess) sess.pty.resize(msg.cols, msg.rows);
        break;
      }

      case "detach": {
        if (currentSessionId) {
          detachClient(currentSessionId, ws);
          currentSessionId = null;
        }
        break;
      }
    }
  });

  ws.on("close", () => {
    if (currentSessionId) {
      detachClient(currentSessionId, ws);
    }
  });
});
