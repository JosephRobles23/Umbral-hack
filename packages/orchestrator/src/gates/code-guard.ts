import type { Gatekeeper } from "@umbral/contracts";

export const codeGuard: Gatekeeper = {
  id: "code-guard",
  mode: "coercive",
  evaluate: (context) => {
    if (!context.edeId) {
      return { pass: false, reason: "[S12] Modificación sin EDE asociada: bloqueada." };
    }
    if (context.edeStatus !== "accepted") {
      return {
        pass: false,
        reason: `[S12] EDE ${context.edeId} no está aprobada (status: ${context.edeStatus}): bloqueada.`,
      };
    }
    return { pass: true };
  },
};
