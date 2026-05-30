import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getTerminalStore, getEdeStore } from "@/lib/db";
import { generateClaudeMd } from "@/lib/claude-md";
import type { TerminalSession } from "@umbral/contracts";

const WS_PORT = Number(process.env.UMBRAL_WS_PORT ?? 3099);

export async function GET(): Promise<NextResponse> {
  const store = getTerminalStore();
  const sessions = store.getRecent(20);
  return NextResponse.json({ sessions, wsPort: WS_PORT });
}

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as {
    edeId?: string;
    cwd?: string;
    shell?: string;
    args?: string[];
  };

  const id = randomUUID();
  const cwd = body.cwd || process.cwd();

  let claudeMdPath: string | null = null;
  try {
    const edes = getEdeStore().getAll();
    claudeMdPath = generateClaudeMd(edes, cwd);
  } catch {
    // CLAUDE.md generation is best-effort
  }

  const now = new Date().toISOString();
  const session: TerminalSession = {
    id,
    edeId: body.edeId ?? null,
    pid: 0,
    status: "active",
    workingDirectory: cwd,
    claudeMdPath,
    createdAt: now,
    lastActivityAt: now,
    terminatedAt: null,
  };

  getTerminalStore().save(session);

  return NextResponse.json({
    sessionId: id,
    wsPort: WS_PORT,
    claudeMdPath,
    config: {
      shell: body.shell || "claude",
      args: body.args || [],
      cols: 120,
      rows: 30,
      env: {},
      cwd,
    },
  });
}
