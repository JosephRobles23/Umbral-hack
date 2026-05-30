export {
  canEnterDesign,
  createSession,
  submitAnswer,
  applyOverride,
  createDebtRecord,
  getQuestionsForLevel,
  evaluateAnswer,
  computeAlignmentScore,
  computeGaps,
  FLOOR,
  DEFAULT_THRESHOLD,
} from "./grill";

export { HookRegistry } from "./hooks";
export type { HookPoint } from "./hooks";

export {
  computeMinimalScope,
  flagCoupling,
  onChange,
  SUSPICIOUS_RATIO,
} from "./doc-regen";

export { c4LayersFor, projectC4, reprojectC4 } from "./c4";

export { codeGuard, planGuard, createCommitGuard, runGraduatedPipeline } from "./gates";
export type { PipelineStage, PipelineResult, StageRunner } from "./gates";

export { verifyContract, verifyAllContracts } from "./layers";
export { assembleClaudeContext } from "./claude-context";

export { comprehensionGate, computeCdr, validateSignal } from "./phases/verify";
export type { ComprehensionResult } from "./phases/verify";
