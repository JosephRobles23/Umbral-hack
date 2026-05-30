import type { TechnicalPlan } from "@umbral/contracts";
import { assertBoundary } from "./boundary";

export interface TechnicalCriteria {
  edeRefs: string[];
  layerContracts: string[];
  unitTests: string[];
  sadPaths: string[];
  coverageTarget: number;
  c4Snapshot: string;
}

export function createTechnicalPlan(criteria: TechnicalCriteria): TechnicalPlan {
  if (criteria.unitTests.length === 0) {
    throw new Error("[S13] Plan técnico sin unitTests: rechazado por PlanGuard.");
  }

  const plan: TechnicalPlan = {
    id: `tp-${Date.now()}`,
    edeRefs: criteria.edeRefs,
    layerContracts: criteria.layerContracts,
    testStrategy: {
      unitTests: criteria.unitTests,
      sadPaths: criteria.sadPaths,
      coverageTarget: criteria.coverageTarget,
    },
    c4Snapshot: criteria.c4Snapshot,
    rationale: `Plan técnico basado en ${criteria.edeRefs.length} EDEs, ${criteria.layerContracts.length} contratos.`,
  };

  assertBoundary(plan as unknown as Record<string, unknown>, "technical");
  return plan;
}
