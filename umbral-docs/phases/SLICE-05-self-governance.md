# SLICE 5 — Auto-Gobernanza (Contratos + Gatekeepers)

> **El punto de inflexión.** Aquí Umbral instala los mecanismos que le permiten gobernarse a sí mismo. A partir de este slice: dogfooding (EDE-007).

## Objetivo
Implementar S5 (LayerContract verificable en build) y S12 (los tres gatekeepers GaaS). Conectarlos a las tareas de turbo. Desde aquí, abrir un slice nuevo exige pasar por los propios gates de Umbral.

## EDEs que materializa
`EDE-007-self-governance`. Completa `S5`; introduce `S12`. Usa `S3` (gates como hooks).

## Contratos que toca
- **L3→L4**: toda transición de fase pasó por `Gatekeeper.evaluate`; el BFF no expone artefactos no aprobados.
- **L1↔Lx**: cada `LayerContract` respaldado por ≥1 test unitario; se re-verifica ante `DocRegenEvent` (S2).

## Scaffolding
```
packages/contracts/src/layers.ts   # LayerContract, Invariant (S5)
packages/contracts/src/gates.ts    # Gatekeeper, TestPlan (S12)
packages/orchestrator/src/gates/code-guard.ts    # coercivo
packages/orchestrator/src/gates/plan-guard.ts     # normativo
packages/orchestrator/src/gates/commit-guard.ts   # adaptativo (pipeline graduado)
turbo.json  # añade tasks gate:plan, gate:commit
```

## Los tres gatekeepers (GaaS, arXiv:2508.18765)
```ts
// CodeGuard (coercivo): bloquea modificaciones sin plan aprobado (S11).
// PlanGuard (normativo): exige cobertura de sad-paths y unitTests poblado.
// CommitGuard (adaptativo): pipeline graduado:
//   tests de impacto -> pytest/vitest dirigido -> suite completa.
export const planGuard: Gatekeeper = {
  mode: "normative",
  evaluate: (t) => t.plan.tests.unitTests.length === 0
    ? { pass: false, reason: "[S12] Plan sin tests unitarios: rechazado." }
    : { pass: true },
};
```

## Criterios de aceptación
- [ ] `CodeGuard` bloquea una modificación sin EDE/plan aprobado.
- [ ] `PlanGuard` rechaza un plan sin `unitTests`.
- [ ] `CommitGuard` ejecuta el pipeline graduado en orden.
- [ ] Un `LayerContract` violado **falla en build** (fail-fast).
- [ ] `turbo gate:commit` corre como parte del pipeline.

## Tests (S12 — ahora auto-verificados)
- `gatekeeper.test.ts`: cada guard en su modo; transición sin gate aprobado es rechazada.
- `layers.test.ts`: violación de invariante de contrato falla.

## Exit condition
Umbral ahora se gobierna a sí mismo. **El Slice 6 en adelante DEBE pasar por estos gates.** Si intentas abrir el Slice 6 sin una EDE aprobada y tests, CodeGuard te detiene. La tesis de v2 ("construirse comprendiéndose a sí mismo") es ahora operativa.
