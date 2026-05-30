import { NextResponse } from "next/server";
import { getGrillStore } from "@/lib/db";
import { submitAnswer } from "@umbral/orchestrator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const { questionId, answer } = await request.json();

  const store = getGrillStore();
  const session = store.getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const updated = submitAnswer(session, questionId, answer);
  store.saveSession(updated);
  return NextResponse.json(updated);
}
