import type { EvidenceAdapter, EvidenceContext, ComprehensionSignal } from "@umbral/contracts";

export interface LangfuseTrace {
  traceId: string;
  retryLoops: number;
  toolMisfires: number;
  latencyMs: number;
  tokenCount: number;
}

export function createLangfuseAdapter(traces?: LangfuseTrace[]): EvidenceAdapter {
  return {
    id: "langfuse-s9",
    produce(context: EvidenceContext): ComprehensionSignal {
      const sessionTraces = traces ?? [];

      const retryLoops = sessionTraces.reduce((sum, t) => sum + t.retryLoops, 0);
      const toolMisfires = sessionTraces.reduce((sum, t) => sum + t.toolMisfires, 0);
      const avgLatency = sessionTraces.length > 0
        ? sessionTraces.reduce((sum, t) => sum + t.latencyMs, 0) / sessionTraces.length
        : 0;

      const derivedQuestions: string[] = [];
      if (retryLoops > 3) derivedQuestions.push("¿Por qué hay tantos reintentos en esta sesión?");
      if (toolMisfires > 0) derivedQuestions.push("¿Qué herramientas fallaron y por qué?");

      return {
        sourceId: "langfuse-s9",
        correlationId: context.sessionId,
        timestamp: new Date().toISOString(),
        metrics: [
          { name: "retryLoops", value: retryLoops, unit: "count" },
          { name: "toolMisfires", value: toolMisfires, unit: "count" },
          { name: "avgLatency", value: avgLatency, unit: "ms" },
        ],
        derivedQuestions,
      };
    },
  };
}
