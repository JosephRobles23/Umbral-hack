const BUSINESS_KEYS = ["retorno", "moat", "alineacionEstrategica", "verdict"];
const TECH_KEYS = ["edeRefs", "layerContracts", "testStrategy", "c4Snapshot"];

export function assertBoundary(
  plan: Record<string, unknown>,
  kind: "business" | "technical",
): void {
  const forbidden = kind === "technical" ? BUSINESS_KEYS : TECH_KEYS;
  const leaked = Object.keys(plan).filter((k) => forbidden.includes(k));
  if (leaked.length > 0) {
    throw new Error(
      `[S11] Frontera negocio/técnico cruzada: ${leaked.join(", ")}`,
    );
  }
}
