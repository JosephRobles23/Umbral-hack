# SLICE 4 — Documentación Viva + C4 Auto-Actualizado

> El cierre del lazo anti-staleness. Un cambio dispara regeneración granular que actualiza el C4 en el frontend. Último slice de bootstrap manual (EDE-007).

## Objetivo
S2 detecta un cambio, emite un `DocRegenEvent` con scope mínimo, y S6 (C4) + S8 (embeddings) reaccionan **solo a ese evento**. El visor C4 del frontend re-renderiza las capas afectadas.

## EDEs que materializa
`EDE-002-change-source`. Introduce `S2` y `S6`; acopla `S8` a S2.

## Contratos que toca
- **Fuente única (EDE-002)**: solo S2 detecta; S6/S8 reaccionan.
- **L4→L5**: el visor C4 se suscribe a `C4RegenTrigger` vía SSE.

## Scaffolding
```
packages/contracts/src/doc-regen.ts   # DocRegenEvent, DocNode (S2)
packages/contracts/src/c4.ts          # C4Model, C4RegenTrigger (S6)
packages/orchestrator/src/doc-regen.ts # detector + cálculo de scope mínimo
packages/orchestrator/src/c4.ts        # proyector C4 desde DocNode
apps/web/components/c4-viewer/C4Viewer.tsx  # escucha C4RegenTrigger (SSE)
apps/web/app/api/events/route.ts       # SSE stream
```

## Archivo clave — fuente única (EDE-002)
```ts
// SOLO S2 emite. S6 y S8 se suscriben; nunca observan el código por su cuenta.
export function onChange(diff: ChangeDiff): DocRegenEvent {
  const scope = computeMinimalScope(diff);              // scope mínimo, no total
  if (scope.length / diff.size > SUSPICIOUS_RATIO) flagCoupling(scope); // acoplamiento excesivo
  const ev = { trigger: diff.kind, scope, diff, affectedC4Layers: c4LayersFor(scope) };
  emit(ev); // -> S6.reproject(ev), S8.reindex(ev), S5.reverify(ev)
  return ev;
}
```

## Criterios de aceptación
- [ ] Un cambio produce un `DocRegenEvent` con scope **mínimo** (no total).
- [ ] S6 re-proyecta solo las capas C4 afectadas; S8 re-indexa solo los chunks afectados.
- [ ] El visor C4 del frontend se actualiza solo (sin recargar la página).
- [ ] El desarrollador nunca edita el C4 a mano (skill implícita).

## Tests (S12)
- `doc-regen.test.ts`: scope mínimo; scope desproporcionado se marca; suscriptores reciben el mismo evento.
- `c4.test.ts`: re-proyección solo de capas afectadas.

## Exit condition
La documentación y el diagrama C4 ya no envejecen: derivan del estado real vía una única fuente. **Fin del bootstrap manual.**
