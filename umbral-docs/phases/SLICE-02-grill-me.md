# SLICE 2 — Grill Me (Fase de Alineación)

> Primer subsistema agéntico. La IA interroga al humano hasta alcanzar comprensión compartida antes de permitir el diseño. Bootstrap manual (EDE-007).

## Objetivo
Una sesión Grill Me que genera preguntas adaptadas al perfil, evalúa respuestas, calcula `alignmentScore`, y **bloquea F2+** hasta alinear — con override que registra deuda visible.

## EDEs que materializa
`EDE-005-grill-blocking`. Introduce `S1` y el primer uso de `S3` (hooks).

## Contratos que toca
- **L3→L4**: `GrillSession.status` gobierna si F2 está accesible. El BFF nunca abre F2 sin `aligned` u `overridden`.

## Scaffolding
```
packages/contracts/src/grill.ts      # GrillSession, GrillQuestion, GrillRound (de v2 S1)
packages/orchestrator/src/grill.ts   # motor: genera preguntas, evalúa, calcula score
packages/orchestrator/src/hooks.ts   # S3 — HookRegistry (4 puntos), usado por grill
apps/web/components/grill/GrillPanel.tsx   # chat invertido: la IA pregunta
apps/web/app/api/grill/route.ts      # L4
```

## Archivo clave — el bloqueo con override (EDE-005)
```ts
const FLOOR = 30; // piso mínimo absoluto: por debajo, ni override aplica
export function canEnterDesign(s: GrillSession): GateResult {
  if (s.alignmentScore >= s.threshold) return { open: true, status: "aligned" };
  if (s.override) {
    if (s.alignmentScore < FLOOR) throw new Error("[EDE-005] Override no aplica bajo el piso mínimo.");
    recordCognitiveDebt(s, s.threshold - s.alignmentScore); // visible en CDR
    return { open: true, status: "overridden" };
  }
  return { open: false, status: "blocked", gaps: s.unresolvedGaps };
}
```

## Criterios de aceptación
- [ ] La IA genera preguntas calibradas al `cognitiveProfile`.
- [ ] `alignmentScore >= umbral` abre F2; por debajo, la bloquea.
- [ ] El override desbloquea y crea un registro de deuda visible en el frontend.
- [ ] Override por debajo del piso (FLOOR) es rechazado.

## Tests (S12)
- `grill.test.ts`: score≥umbral abre; score<umbral bloquea; override registra deuda y abre; override bajo el piso lanza.

## Exit condition
No se puede entrar a diseño sin pasar (o overridear conscientemente) Grill Me, y la deuda queda registrada. El engagement cognitivo es ahora estructural, no opcional.
