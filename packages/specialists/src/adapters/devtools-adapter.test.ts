import { describe, it, expect } from "vitest";
import type { EvidenceContext } from "@umbral/contracts";
import { createDevToolsAdapter } from "./devtools-adapter";
import type { DevToolsEntry } from "./devtools-adapter";

const CTX: EvidenceContext = {
  sessionId: "session-2",
  affectedPaths: ["apps/web"],
};

describe("DevToolsAdapter (S10 stub)", () => {
  it("produce ComprehensionSignal válido sin entries", () => {
    const adapter = createDevToolsAdapter([]);
    const signal = adapter.produce(CTX);

    expect(signal.sourceId).toBe("devtools-s10");
    expect(signal.correlationId).toBe("session-2");
    expect(signal.metrics).toHaveLength(3);
  });

  it("cuenta errores y calcula tiempo promedio", () => {
    const entries: DevToolsEntry[] = [
      { type: "error", message: "Uncaught TypeError", timestamp: "2026-01-01T00:00:00Z" },
      { type: "timing", message: "render", timestamp: "2026-01-01T00:00:01Z", durationMs: 200 },
      { type: "timing", message: "fetch", timestamp: "2026-01-01T00:00:02Z", durationMs: 800 },
      { type: "console", message: "info log", timestamp: "2026-01-01T00:00:03Z" },
    ];
    const adapter = createDevToolsAdapter(entries);
    const signal = adapter.produce(CTX);

    const errors = signal.metrics.find((m) => m.name === "consoleErrors");
    expect(errors!.value).toBe(1);

    const avgTime = signal.metrics.find((m) => m.name === "avgOperationTime");
    expect(avgTime!.value).toBe(500);

    const total = signal.metrics.find((m) => m.name === "totalEntries");
    expect(total!.value).toBe(4);
  });

  it("genera preguntas cuando hay errores", () => {
    const entries: DevToolsEntry[] = [
      { type: "error", message: "fail", timestamp: "2026-01-01T00:00:00Z" },
    ];
    const adapter = createDevToolsAdapter(entries);
    const signal = adapter.produce(CTX);

    expect(signal.derivedQuestions.some((q) => q.includes("errores"))).toBe(true);
  });
});
