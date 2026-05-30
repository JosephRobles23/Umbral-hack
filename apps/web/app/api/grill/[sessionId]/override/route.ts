import { NextResponse } from "next/server";
import { getGrillStore } from "@/lib/db";
import { applyOverride, createDebtRecord } from "@umbral/orchestrator";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  const store = getGrillStore();
  const session = store.getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  try {
    const updated = applyOverride(session);
    const debt = createDebtRecord(session);
    store.saveSession(updated);
    store.saveDebt(debt);
    return NextResponse.json({ session: updated, debt });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Override failed" },
      { status: 403 },
    );
  }
}
