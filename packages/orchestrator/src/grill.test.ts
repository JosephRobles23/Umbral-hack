import { describe, it, expect } from "vitest";
import type { GrillSession } from "@umbral/contracts";
import { canEnterDesign, applyOverride, createDebtRecord, FLOOR } from "./grill";

function makeSession(overrides: Partial<GrillSession> = {}): GrillSession {
  return {
    id: "session-1",
    edeId: "EDE-TEST",
    status: "in_progress",
    threshold: 70,
    alignmentScore: 0,
    rounds: [],
    unresolvedGaps: [],
    override: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("canEnterDesign (EDE-005)", () => {
  it("score >= umbral abre F2", () => {
    const session = makeSession({ alignmentScore: 75 });
    const result = canEnterDesign(session);
    expect(result.open).toBe(true);
    expect(result.status).toBe("aligned");
  });

  it("score < umbral bloquea F2", () => {
    const session = makeSession({ alignmentScore: 50, unresolvedGaps: ["trade-offs"] });
    const result = canEnterDesign(session);
    expect(result.open).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.gaps).toContain("trade-offs");
  });

  it("override registra deuda y abre F2", () => {
    const session = makeSession({ alignmentScore: 50, override: true });
    const result = canEnterDesign(session);
    expect(result.open).toBe(true);
    expect(result.status).toBe("overridden");

    const debt = createDebtRecord(session);
    expect(debt.gap).toBe(20);
    expect(debt.sessionId).toBe("session-1");
  });

  it("override bajo el piso mínimo lanza error", () => {
    const session = makeSession({ alignmentScore: 10, override: true });
    expect(() => canEnterDesign(session)).toThrow("[EDE-005]");
  });
});

describe("applyOverride", () => {
  it("aplica override cuando score >= FLOOR", () => {
    const session = makeSession({ alignmentScore: FLOOR + 10 });
    const result = applyOverride(session);
    expect(result.override).toBe(true);
    expect(result.status).toBe("overridden");
  });

  it("rechaza override bajo el piso", () => {
    const session = makeSession({ alignmentScore: FLOOR - 1 });
    expect(() => applyOverride(session)).toThrow("[EDE-005]");
  });
});
