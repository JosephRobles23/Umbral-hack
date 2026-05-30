# SLICE 8 — Generador de Planes (Técnico ≠ Negocio)

> Higiene cognitiva: dos artefactos que nunca se mezclan. **Dogfooding.**

## Objetivo
Un generador que produce `BusinessPlan` (F0) y `TechnicalPlan` (F2) como artefactos separados, con un **invariante de frontera**: ningún campo de negocio aparece en el plan técnico ni viceversa.

## EDEs que materializa
Introduce `S11`. Apoya el fundamento "plan técnico ≠ plan de negocio" de v2 Parte I.

## Contratos que toca
- **L2→L4**: ambos planes cumplen schemas distintos; el generador rechaza (fail-fast S13) un plan que cruce la frontera.

## Scaffolding
```
packages/contracts/src/plans.ts     # BusinessPlan, TechnicalPlan (S11)
packages/specialists/src/plan-generator/business.ts   # criterios Munoz (R15)
packages/specialists/src/plan-generator/technical.ts    # deriva de EDEs + LayerContracts
packages/specialists/src/plan-generator/boundary.ts     # invariante de frontera
```

## Archivo clave — el invariante de frontera (S11)
```ts
const BUSINESS_KEYS = ["retorno", "moat", "alineacionEstrategica", "verdict"];
const TECH_KEYS = ["edeRefs", "layerContracts", "testStrategy", "c4Snapshot"];
export function assertBoundary(plan: object, kind: "business" | "technical") {
  const forbidden = kind === "technical" ? BUSINESS_KEYS : TECH_KEYS;
  const leaked = Object.keys(plan).filter(k => forbidden.includes(k));
  if (leaked.length) throw new Error(`[S11] Frontera negocio/técnico cruzada: ${leaked.join(", ")}`);
}
```

## Criterios de aceptación
- [ ] `BusinessPlan` aplica los 5 criterios de Munoz y emite go/no_go/pivot.
- [ ] `TechnicalPlan` deriva de EDEs y LayerContracts, incluye TestPlan con unitTests.
- [ ] Un plan que mezcla campos de negocio y técnicos es **rechazado** (invariante de frontera).

## Tests (S12, vía gates)
- `boundary.test.ts`: plan técnico con campo de negocio lanza; plan de negocio con campo técnico lanza.
- `technical.test.ts`: TechnicalPlan sin unitTests es rechazado por PlanGuard.

## Exit condition
Negocio y técnica viven en artefactos separados que el sistema mantiene puros. El framework está funcionalmente completo: las 6 fases y los 13 subsistemas tienen su contrato implementado o materializado.
