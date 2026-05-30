import { describe, it, expect } from "vitest";
import type { EvidenceContext } from "@umbral/contracts";
import { createLangfuseAdapter } from "./langfuse-adapter";
import type { LangfuseTrace } from "./langfuse-adapter";

const CTX: EvidenceContext = {
  sessionId: "session-1",
  affectedPaths: ["packages/persistence"],
};

describe("LangfuseAdapter (S9 stub)", () => {
  it("produce ComprehensionSignal válido sin trazas", () => {
    const adapter = createLangfuseAdapter([]);
    const signal = adapter.produce(CTX);

    expect(signal.sourceId).toBe("langfuse-s9");
    expect(signal.correlationId).toBe("session-1");
    expect(signal.metrics).toHaveLength(3);
    expect(signal.metrics.every((m) => typeof m.value === "number")).toBe(true);
  });

  it("agrega métricas de trazas", () => {
    const traces: LangfuseTrace[] = [
      { traceId: "t1", retryLoops: 2, toolMisfires: 1, latencyMs: 500, tokenCount: 100 },
      { traceId: "t2", retryLoops: 3, toolMisfires: 0, latencyMs: 300, tokenCount: 200 },
    ];
    const adapter = createLangfuseAdapter(traces);
    const signal = adapter.produce(CTX);

    const retries = signal.metrics.find((m) => m.name === "retryLoops");
    expect(retries!.value).toBe(5);

    const misfires = signal.metrics.find((m) => m.name === "toolMisfires");
    expect(misfires!.value).toBe(1);

    const latency = signal.metrics.find((m) => m.name === "avgLatency");
    expect(latency!.value).toBe(400);
  });

  it("genera preguntas derivadas cuando hay problemas", () => {
    const traces: LangfuseTrace[] = [
      { traceId: "t1", retryLoops: 5, toolMisfires: 2, latencyMs: 100, tokenCount: 50 },
    ];
    const adapter = createLangfuseAdapter(traces);
    const signal = adapter.produce(CTX);

    expect(signal.derivedQuestions.length).toBeGreaterThan(0);
    expect(signal.derivedQuestions.some((q) => q.includes("reintentos"))).toBe(true);
    expect(signal.derivedQuestions.some((q) => q.includes("herramientas"))).toBe(true);
  });

  it("no expone detalles internos de Langfuse en el signal", () => {
    const adapter = createLangfuseAdapter([]);
    const signal = adapter.produce(CTX);
    expect(signal.raw).toBeUndefined();
  });
});
