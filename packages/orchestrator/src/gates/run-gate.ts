import { codeGuard } from "./code-guard";
import { planGuard } from "./plan-guard";
import { createCommitGuard } from "./commit-guard";
import type { StageRunner } from "./commit-guard";

const defaultRunner: StageRunner = (stage) => {
  return { stage, pass: true };
};

const gate = process.argv[2];

if (!gate) {
  console.error("Usage: run-gate <plan|commit>");
  process.exit(1);
}

if (gate === "plan") {
  const ctx = {
    edeId: process.env.UMBRAL_EDE_ID,
    edeStatus: process.env.UMBRAL_EDE_STATUS ?? "accepted",
    plan: {
      unitTests: process.env.UMBRAL_UNIT_TESTS?.split(",").filter(Boolean) ?? [],
      sadPaths: process.env.UMBRAL_SAD_PATHS?.split(",").filter(Boolean) ?? [],
      coverageTarget: Number(process.env.UMBRAL_COVERAGE_TARGET ?? "0.8"),
    },
  };

  const codeResult = codeGuard.evaluate(ctx);
  if (!codeResult.pass) {
    console.error(codeResult.reason);
    process.exit(1);
  }

  const planResult = planGuard.evaluate(ctx);
  if (!planResult.pass) {
    console.error(planResult.reason);
    process.exit(1);
  }

  console.log("gate:plan passed");
} else if (gate === "commit") {
  const files = process.env.UMBRAL_IMPACTED_FILES?.split(",").filter(Boolean) ?? [];
  const commitGuard = createCommitGuard(defaultRunner);
  const result = commitGuard.evaluate({ impactedFiles: files.length > 0 ? files : ["all"] });

  if (!result.pass) {
    console.error(result.reason);
    process.exit(1);
  }

  console.log("gate:commit passed");
} else {
  console.error(`Unknown gate: ${gate}`);
  process.exit(1);
}
