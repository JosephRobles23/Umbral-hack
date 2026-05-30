import type { BusinessPlan } from "@umbral/contracts";
import { assertBoundary } from "./boundary";

export interface BusinessCriteria {
  retorno: string;
  moat: string;
  alineacionEstrategica: string;
}

export function createBusinessPlan(criteria: BusinessCriteria): BusinessPlan {
  const hasRetorno = criteria.retorno.trim().length > 0;
  const hasMoat = criteria.moat.trim().length > 0;
  const hasAlineacion = criteria.alineacionEstrategica.trim().length > 0;

  let verdict: BusinessPlan["verdict"] = "go";
  const missing: string[] = [];

  if (!hasRetorno) missing.push("retorno");
  if (!hasMoat) missing.push("moat");
  if (!hasAlineacion) missing.push("alineación estratégica");

  if (missing.length >= 2) verdict = "no_go";
  else if (missing.length === 1) verdict = "pivot";

  const plan: BusinessPlan = {
    id: `bp-${Date.now()}`,
    retorno: criteria.retorno,
    moat: criteria.moat,
    alineacionEstrategica: criteria.alineacionEstrategica,
    verdict,
    rationale:
      verdict === "go"
        ? "Todos los criterios de negocio satisfechos."
        : `Criterios faltantes: ${missing.join(", ")}.`,
  };

  assertBoundary(plan as unknown as Record<string, unknown>, "business");
  return plan;
}
