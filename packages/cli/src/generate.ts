import type { Ede } from "@umbral/contracts";
import type { Detection } from "./detect/types.js";
import { getTemplate } from "./templates.js";

export function generateProposals(detections: Detection[]): Ede[] {
  const proposals: Ede[] = [];
  let counter = 1;

  for (const detection of detections) {
    const template = getTemplate(detection);
    if (!template) continue;

    const now = new Date().toISOString();
    const id = `EDE-${String(counter).padStart(3, "0")}-${detection.slug}`;

    proposals.push({
      id,
      title: template.title(detection),
      version: 1,
      status: "proposed",
      cognitiveLevel: template.cognitiveLevel,
      complexityTier: template.complexityTier,
      whatAndHow: {
        decision: template.decision(detection),
        mechanism: template.mechanism(detection),
      },
      why: {
        rationale: template.rationale(detection),
        alternativesConsidered: template.alternatives(detection),
        references: [],
      },
      whatNotToDo: {
        antiPatterns: template.antiPatterns(detection),
      },
      whatsNext: {
        continuations: [],
        openQuestions: [],
      },
      contracts: {
        layerContracts: [],
        verifiedBy: [],
      },
      tests: {
        unitTests: [],
        sadPaths: [],
        coverageTarget: 0.8,
      },
      provenance: {
        phase: "onboarding",
        slice: null,
        createdBy: "umbral-cli",
        createdAt: now,
        lastUpdated: now,
      },
    });

    counter++;
  }

  return proposals;
}
