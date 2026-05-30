export interface ComprehensionMetric {
  name: string;
  value: number;
  unit: string;
}

export interface ComprehensionSignal {
  sourceId: string;
  correlationId: string;
  timestamp: string;
  metrics: ComprehensionMetric[];
  derivedQuestions: string[];
  raw?: Record<string, unknown>;
}

export interface EvidenceAdapter {
  id: string;
  produce(context: EvidenceContext): ComprehensionSignal;
}

export interface EvidenceContext {
  sessionId: string;
  affectedPaths: string[];
  metadata?: Record<string, unknown>;
}
