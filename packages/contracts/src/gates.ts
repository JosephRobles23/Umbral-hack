export type GateMode = "coercive" | "normative" | "adaptive";

export interface TestPlan {
  unitTests: string[];
  sadPaths: string[];
  coverageTarget: number;
}

export interface GateEvaluation {
  pass: boolean;
  reason?: string;
}

export interface GateContext {
  edeId?: string;
  edeStatus?: string;
  plan?: TestPlan;
  impactedFiles?: string[];
}

export interface Gatekeeper {
  id: string;
  mode: GateMode;
  evaluate: (context: GateContext) => GateEvaluation;
}
