import { describe, it, expect } from "vitest";
import type { EvidenceAdapter, EvidenceContext, ComprehensionSignal } from "@umbral/contracts";
import { comprehensionGate, computeCdr, validateSignal } from "./verify";

const CTX: EvidenceContext = {
  sessionId: "session-1",
  affectedPaths: ["packages/persistence"],
};

function makeAdapter(id: string, signal: Partial<ComprehensionSignal>): EvidenceAdapter {
  return {
    id,
    produce: () => ({
      sourceId: id,
      correlationId: "session-1",
      timestamp: "2026-01-01T00:00:00Z",
      metrics: [],
      derivedQuestions: [],
      ...signal,
    }),
  };
}

describe("comprehensionGate (F4)", () => {
  it("agrega señales de N adaptadores sin referenciarlos por nombre", () => {
    const a1 = makeAdapter("adapter-a", {
      metrics: [{ name: "retryLoops", value: 1, unit: "count" }],
      derivedQuestions: ["¿Por qué?"],
    });
    const a2 = makeAdapter("adapter-b", {
      metrics: [{ name: "consoleErrors", value: 0, unit: "count" }],
      derivedQuestions: ["¿Qué pasó?"],
    });

    const result = comprehensionGate([a1, a2], CTX);

    expect(result.signals).toHaveLength(2);
    expect(result.questions).toEqual(["¿Por qué?", "¿Qué pasó?"]);
    expect(typeof result.cdr).toBe("number");
  });

  it("rechaza señal inválida con [S13]", () => {
    const bad: EvidenceAdapter = {
      id: "bad",
      produce: () => ({
        sourceId: "",
        correlationId: "",
        timestamp: "",
        metrics: [],
        derivedQuestions: [],
      }),
    };

    expect(() => comprehensionGate([bad], CTX)).toThrow("[S13]");
  });

  it("funciona con cero adaptadores", () => {
    const result = comprehensionGate([], CTX);
    expect(result.signals).toHaveLength(0);
    expect(result.cdr).toBe(1);
  });
});

describe("validateSignal", () => {
  it("acepta señal válida", () => {
    const signal: ComprehensionSignal = {
      sourceId: "test",
      correlationId: "corr-1",
      timestamp: "2026-01-01T00:00:00Z",
      metrics: [{ name: "x", value: 1, unit: "count" }],
      derivedQuestions: [],
    };
    expect(validateSignal(signal)).toBe(true);
  });

  it("rechaza señal sin sourceId", () => {
    const signal = {
      sourceId: "",
      correlationId: "corr-1",
      timestamp: "",
      metrics: [],
      derivedQuestions: [],
    };
    expect(validateSignal(signal)).toBe(false);
  });
});

describe("computeCdr", () => {
  it("CDR alto cuando hay muchos problemas", () => {
    const signals: ComprehensionSignal[] = [
      {
        sourceId: "a",
        correlationId: "c",
        timestamp: "",
        metrics: [
          { name: "retryLoops", value: 10, unit: "count" },
          { name: "toolMisfires", value: 5, unit: "count" },
        ],
        derivedQuestions: [],
      },
    ];
    const cdr = computeCdr(signals);
    expect(cdr).toBe(1);
  });

  it("CDR cero cuando no hay problemas", () => {
    const signals: ComprehensionSignal[] = [
      {
        sourceId: "a",
        correlationId: "c",
        timestamp: "",
        metrics: [
          { name: "retryLoops", value: 0, unit: "count" },
          { name: "toolMisfires", value: 0, unit: "count" },
        ],
        derivedQuestions: [],
      },
    ];
    expect(computeCdr(signals)).toBe(0);
  });
});
