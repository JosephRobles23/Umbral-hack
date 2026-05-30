import type { EvidenceAdapter, EvidenceContext, ComprehensionSignal } from "@umbral/contracts";

export interface DevToolsEntry {
  type: "console" | "timing" | "error";
  message: string;
  timestamp: string;
  durationMs?: number;
}

export function createDevToolsAdapter(entries?: DevToolsEntry[]): EvidenceAdapter {
  return {
    id: "devtools-s10",
    produce(context: EvidenceContext): ComprehensionSignal {
      const logs = entries ?? [];

      const errors = logs.filter((e) => e.type === "error");
      const timings = logs.filter((e) => e.type === "timing");
      const avgDuration = timings.length > 0
        ? timings.reduce((sum, t) => sum + (t.durationMs ?? 0), 0) / timings.length
        : 0;

      const derivedQuestions: string[] = [];
      if (errors.length > 0) derivedQuestions.push("¿Qué errores de consola están ocurriendo?");
      if (avgDuration > 1000) derivedQuestions.push("¿Por qué las operaciones son tan lentas?");

      return {
        sourceId: "devtools-s10",
        correlationId: context.sessionId,
        timestamp: new Date().toISOString(),
        metrics: [
          { name: "consoleErrors", value: errors.length, unit: "count" },
          { name: "avgOperationTime", value: avgDuration, unit: "ms" },
          { name: "totalEntries", value: logs.length, unit: "count" },
        ],
        derivedQuestions,
      };
    },
  };
}
