import type { Gatekeeper, GateEvaluation } from "@umbral/contracts";

export type PipelineStage = "impact" | "directed" | "full";

export interface PipelineResult {
  stage: PipelineStage;
  pass: boolean;
  reason?: string;
}

export type StageRunner = (stage: PipelineStage, files: string[]) => PipelineResult;

const PIPELINE_ORDER: PipelineStage[] = ["impact", "directed", "full"];

export function runGraduatedPipeline(
  files: string[],
  runner: StageRunner,
): { pass: boolean; results: PipelineResult[] } {
  const results: PipelineResult[] = [];

  for (const stage of PIPELINE_ORDER) {
    const result = runner(stage, files);
    results.push(result);
    if (!result.pass) {
      return { pass: false, results };
    }
  }

  return { pass: true, results };
}

export function createCommitGuard(runner: StageRunner): Gatekeeper {
  return {
    id: "commit-guard",
    mode: "adaptive",
    evaluate: (context): GateEvaluation => {
      const files = context.impactedFiles ?? [];
      if (files.length === 0) {
        return { pass: false, reason: "[S12] No hay archivos impactados para verificar." };
      }
      const { pass, results } = runGraduatedPipeline(files, runner);
      if (!pass) {
        const failed = results[results.length - 1];
        return {
          pass: false,
          reason: failed.reason ?? `[S12] Pipeline falló en etapa: ${failed.stage}`,
        };
      }
      return { pass: true };
    },
  };
}
