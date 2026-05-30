import type {
  GrillSession,
  GrillQuestion,
  GrillRound,
  GateResult,
  CognitiveDebt,
  CognitiveLevel,
} from "@umbral/contracts";

const FLOOR = 30;
const DEFAULT_THRESHOLD = 70;

export { FLOOR, DEFAULT_THRESHOLD };

export function canEnterDesign(session: GrillSession): GateResult {
  if (session.alignmentScore >= session.threshold) {
    return { open: true, status: "aligned" };
  }
  if (session.override) {
    if (session.alignmentScore < FLOOR) {
      throw new Error("[EDE-005] Override no aplica bajo el piso mínimo.");
    }
    return { open: true, status: "overridden" };
  }
  return { open: false, status: "blocked", gaps: session.unresolvedGaps };
}

export function createDebtRecord(session: GrillSession): CognitiveDebt {
  return {
    id: `debt-${session.id}-${Date.now()}`,
    sessionId: session.id,
    edeId: session.edeId,
    gap: session.threshold - session.alignmentScore,
    reason: `Override con score ${session.alignmentScore}/${session.threshold}. Gaps: ${session.unresolvedGaps.join(", ") || "ninguno"}`,
    createdAt: new Date().toISOString(),
  };
}

const QUESTION_BANK: GrillQuestion[] = [
  {
    id: "q-exp-1",
    text: "¿Cuál es el problema que esta decisión intenta resolver?",
    cognitiveLevel: "explorer",
    topic: "contexto",
  },
  {
    id: "q-exp-2",
    text: "¿Qué restricciones del entorno condicionan esta decisión?",
    cognitiveLevel: "explorer",
    topic: "restricciones",
  },
  {
    id: "q-nav-1",
    text: "¿Por qué se descartaron las alternativas consideradas?",
    cognitiveLevel: "navigator",
    topic: "alternativas",
  },
  {
    id: "q-nav-2",
    text: "¿Qué trade-offs acepta esta decisión y cuáles son sus límites?",
    cognitiveLevel: "navigator",
    topic: "trade-offs",
  },
  {
    id: "q-anc-1",
    text: "¿Qué invariantes deben sostenerse para que esta decisión siga siendo válida?",
    cognitiveLevel: "anchor",
    topic: "invariantes",
  },
  {
    id: "q-anc-2",
    text: "¿Bajo qué condiciones esta decisión debería revisarse o revertirse?",
    cognitiveLevel: "anchor",
    topic: "reversibilidad",
  },
];

export function getQuestionsForLevel(level: CognitiveLevel): GrillQuestion[] {
  const levelOrder: CognitiveLevel[] = ["explorer", "navigator", "anchor"];
  const idx = levelOrder.indexOf(level);
  return QUESTION_BANK.filter(
    (q) => levelOrder.indexOf(q.cognitiveLevel) <= idx,
  );
}

export function evaluateAnswer(answer: string): { score: number; feedback: string } {
  const trimmed = answer.trim();
  if (trimmed.length < 20) {
    return { score: 20, feedback: "Respuesta demasiado breve. Elabora más." };
  }
  if (trimmed.length < 80) {
    return { score: 50, feedback: "Respuesta aceptable. ¿Puedes ser más específico?" };
  }
  if (trimmed.length < 200) {
    return { score: 75, feedback: "Buena respuesta. Demuestra comprensión del tema." };
  }
  return { score: 90, feedback: "Respuesta detallada. Alineación sólida." };
}

export function computeAlignmentScore(rounds: GrillRound[]): number {
  const scored = rounds.filter((r) => r.score !== null);
  if (scored.length === 0) return 0;
  const sum = scored.reduce((acc, r) => acc + (r.score ?? 0), 0);
  return Math.round(sum / scored.length);
}

export function computeGaps(rounds: GrillRound[]): string[] {
  return rounds
    .filter((r) => r.score !== null && r.score < 50)
    .map((r) => r.question.topic);
}

export function createSession(
  id: string,
  edeId: string,
  cognitiveLevel: CognitiveLevel,
): GrillSession {
  const questions = getQuestionsForLevel(cognitiveLevel);
  const now = new Date().toISOString();
  return {
    id,
    edeId,
    status: "in_progress",
    threshold: DEFAULT_THRESHOLD,
    alignmentScore: 0,
    rounds: questions.map((q) => ({
      question: q,
      answer: null,
      score: null,
      feedback: null,
    })),
    unresolvedGaps: [],
    override: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function submitAnswer(
  session: GrillSession,
  questionId: string,
  answer: string,
): GrillSession {
  const updated = { ...session, rounds: [...session.rounds] };
  const idx = updated.rounds.findIndex((r) => r.question.id === questionId);
  if (idx === -1) throw new Error(`Question ${questionId} not found in session.`);

  const { score, feedback } = evaluateAnswer(answer);
  updated.rounds[idx] = { ...updated.rounds[idx], answer, score, feedback };
  updated.alignmentScore = computeAlignmentScore(updated.rounds);
  updated.unresolvedGaps = computeGaps(updated.rounds);
  updated.updatedAt = new Date().toISOString();

  if (updated.alignmentScore >= updated.threshold) {
    updated.status = "aligned";
  }

  return updated;
}

export function applyOverride(session: GrillSession): GrillSession {
  if (session.alignmentScore < FLOOR) {
    throw new Error("[EDE-005] Override no aplica bajo el piso mínimo.");
  }
  return {
    ...session,
    override: true,
    status: "overridden",
    updatedAt: new Date().toISOString(),
  };
}
