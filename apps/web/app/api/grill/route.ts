import { NextResponse } from "next/server";
import { getGrillStore, getEdeStore } from "@/lib/db";
import { createSession } from "@umbral/orchestrator";

export function GET() {
  const store = getGrillStore();
  const session = store.getActiveSession();
  return NextResponse.json(session);
}

export async function POST(request: Request) {
  const { edeId } = await request.json();
  const edeStore = getEdeStore();
  const ede = edeStore.getById(edeId);
  if (!ede) {
    return NextResponse.json({ error: "EDE not found" }, { status: 404 });
  }

  const sessionId = `grill-${Date.now()}`;
  const session = createSession(sessionId, edeId, ede.cognitiveLevel);
  const grillStore = getGrillStore();
  grillStore.saveSession(session);
  return NextResponse.json(session, { status: 201 });
}
