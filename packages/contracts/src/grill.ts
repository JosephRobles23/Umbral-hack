import type { CognitiveLevel } from "./ede";

export interface GrillQuestion {
  id: string;
  text: string;
  cognitiveLevel: CognitiveLevel;
  topic: string;
}

export interface GrillRound {
  question: GrillQuestion;
  answer: string | null;
  score: number | null;
  feedback: string | null;
}

export type GrillStatus = "in_progress" | "aligned" | "overridden" | "blocked";

export interface GrillSession {
  id: string;
  edeId: string;
  status: GrillStatus;
  threshold: number;
  alignmentScore: number;
  rounds: GrillRound[];
  unresolvedGaps: string[];
  override: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GateResult {
  open: boolean;
  status: "aligned" | "overridden" | "blocked";
  gaps?: string[];
}

export interface CognitiveDebt {
  id: string;
  sessionId: string;
  edeId: string;
  gap: number;
  reason: string;
  createdAt: string;
}
