import type { EvidenceAdapter, EvidenceContext, ComprehensionSignal } from "@umbral/contracts";

export interface ComprehensionResult {
  cdr: number;
  signals: ComprehensionSignal[];
  questions: string[];
}

export function computeCdr(signals: ComprehensionSignal[]): number {
  if (signals.length === 0) return 1;

  let totalIssues = 0;
  let totalMetrics = 0;

  for (const signal of signals) {
    for (const metric of signal.metrics) {
      totalMetrics++;
      if (metric.name === "retryLoops" && metric.value > 3) totalIssues++;
      if (metric.name === "toolMisfires" && metric.value > 0) totalIssues++;
      if (metric.name === "consoleErrors" && metric.value > 0) totalIssues++;
      if (metric.name === "avgLatency" && metric.value > 5000) totalIssues++;
      if (metric.name === "avgOperationTime" && metric.value > 2000) totalIssues++;
    }
  }

  return totalMetrics > 0 ? totalIssues / totalMetrics : 0;
}

export function validateSignal(signal: ComprehensionSignal): boolean {
  return (
    typeof signal.sourceId === "string" &&
    signal.sourceId.length > 0 &&
    typeof signal.correlationId === "string" &&
    signal.correlationId.length > 0 &&
    Array.isArray(signal.metrics) &&
    signal.metrics.every(
      (m) =>
        typeof m.name === "string" &&
        typeof m.value === "number" &&
        typeof m.unit === "string",
    )
  );
}

export function comprehensionGate(
  adapters: EvidenceAdapter[],
  context: EvidenceContext,
): ComprehensionResult {
  const signals: ComprehensionSignal[] = [];

  for (const adapter of adapters) {
    const signal = adapter.produce(context);
    if (!validateSignal(signal)) {
      throw new Error(`[S13] Señal inválida del adaptador ${adapter.id}`);
    }
    signals.push(signal);
  }

  const questions = signals.flatMap((s) => s.derivedQuestions);
  const cdr = computeCdr(signals);

  return { cdr, signals, questions };
}
