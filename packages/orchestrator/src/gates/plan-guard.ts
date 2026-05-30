import type { Gatekeeper } from "@umbral/contracts";

export const planGuard: Gatekeeper = {
  id: "plan-guard",
  mode: "normative",
  evaluate: (context) => {
    if (!context.plan) {
      return { pass: false, reason: "[S12] Plan ausente: rechazado." };
    }
    if (context.plan.unitTests.length === 0) {
      return { pass: false, reason: "[S12] Plan sin tests unitarios: rechazado." };
    }
    if (context.plan.sadPaths.length === 0) {
      return { pass: false, reason: "[S12] Plan sin sad-paths: rechazado." };
    }
    return { pass: true };
  },
};
