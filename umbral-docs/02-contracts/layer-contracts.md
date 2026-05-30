# Contratos Entre Capas — Especificación Implementable

Derivado de **Umbral v2.0, Parte IV**. Aquí los contratos pasan de prosa a interfaces verificables. Cada contrato se declara en una EDE (F2) y se verifica en build (S13, fail-fast). Cada uno tiene ≥1 test unitario (S12) y se re-verifica ante un `DocRegenEvent` (S2).

## Forma de un contrato

```ts
// packages/contracts/src/layers.ts
export interface LayerContract {
  fromLayer: LayerId;   // "L1".."L5"
  toLayer: LayerId;
  interface: string;    // nombre de la interfaz que la capa superior puede invocar
  invariants: Invariant[];
  breakingChangePolicy: "fail_fast" | "deprecate_then_remove";
  verifiedBy: string[]; // paths a tests unitarios (S12)
}
export interface Invariant { id: string; description: string; check: string }
```

---

## L1 → L2 — Persistencia hacia Especialistas

**Interfaz**: `SemanticSessionStore`, `DocEmbeddingIndex`, `EdeStore`.

**Invariantes**:
- `L1L2-1` Las lecturas (`search`, `query`, `loadEde`) son **idempotentes y no mutan estado**.
- `L1L2-2` Todo `SessionNode`/`DocChunk` devuelto incluye trazabilidad a su `DocNode` de origen (`sourceDocNode`).
- `L1L2-3` Ningún especialista escribe en persistencia salvo a través de un `DocRegenEvent` emitido por S2 (EDE-002).

**breakingChangePolicy**: `fail_fast`.
**verifiedBy**: `persistence/semantic-store.test.ts`, `persistence/embedding-index.test.ts`.

```ts
// Verificación del invariante L1L2-1 (idempotencia)
test("search no muta estado", () => {
  const before = store.snapshot();
  store.search("query");
  expect(store.snapshot()).toEqual(before);
});
```

---

## L2 → L3 — Especialistas hacia Orquestación

**Interfaz**: cada especialista expone una función que devuelve un tipo con schema versionado (`ComprehensionSignal`, `PolicyDecision`, `BusinessPlan`/`TechnicalPlan`).

**Invariantes**:
- `L2L3-1` Toda salida valida contra su schema versionado **antes** de propagar.
- `L2L3-2` Salida inválida se rechaza en el hook `post_response_validation` (S3); **nunca** llega a L4 (fail-fast S13).
- `L2L3-3` (adaptadores, EDE-004) L3 consume `ComprehensionSignal[]` sin conocer la fuente; los adaptadores no filtran detalles de origen.

**breakingChangePolicy**: `fail_fast`.
**verifiedBy**: `orchestrator/hooks.test.ts`, `orchestrator/phases/verify.test.ts`.

```ts
// Verificación del invariante L2L3-2
test("salida inválida no llega a L4", () => {
  const bad = { /* falta campo requerido */ };
  expect(() => pipeline.run(bad)).toThrow(/\[S13\]/);
});
```

---

## L3 → L4 — Orquestación hacia API/BFF

**Interfaz**: artefactos aprobados (`Ede`, `TechnicalPlan`, `C4Model`, `GrillSession`).

**Invariantes**:
- `L3L4-1` Toda transición de fase pasó por su `Gatekeeper.evaluate` (S12).
- `L3L4-2` El BFF **nunca** expone un artefacto que no superó su gate.
- `L3L4-3` (EDE-005) F2 solo es accesible si `GrillSession.status ∈ {aligned, overridden}`; un `overridden` lleva un registro de deuda asociado.

**breakingChangePolicy**: `fail_fast`.
**verifiedBy**: `orchestrator/gates/gatekeeper.test.ts`, `orchestrator/grill.test.ts`.

---

## L4 → L5 — API/BFF hacia Frontend

**Interfaz**: contratos de datos HTTP/SSE versionados (`GET /api/edes`, `GET /api/edes/:id`, SSE `/api/events`).

**Invariantes**:
- `L4L5-1` Los contratos de datos son versionados y estables.
- `L4L5-2` Un cambio breaking sigue `deprecate_then_remove` (el frontend no se rompe en silencio). Los cambios internos siguen `fail_fast`.
- `L4L5-3` El visor C4 (S6) recibe `C4RegenTrigger` por SSE; cada trigger trae las capas afectadas (no "recargar todo").

**breakingChangePolicy**: `deprecate_then_remove` (esta es la única frontera que NO es fail_fast, porque el frontend es un consumidor que no debe romperse abruptamente).
**verifiedBy**: `apps/web/app/api/edes.test.ts`.

---

## Regla global de re-verificación

```
DocRegenEvent (S2) cuyo scope toca cualquiera de las dos capas de un contrato
        │
        ▼
   re-ejecutar verifiedBy de ese LayerContract
        │
        ├─ pasa  → contrato sigue válido
        └─ falla → build roto (fail-fast S13), drift de contrato detectado
```

Esto convierte cada contrato en un artefacto vivo: no se documenta una vez y se olvida; se re-prueba cada vez que el código que toca sus capas cambia. Es la aplicación directa del campo "Por Qué" de la EDE al nivel de la arquitectura.

---

## Tabla resumen

| Contrato | Política de cambio | Verificado por | Invariante crítico |
|----------|-------------------|----------------|--------------------|
| L1→L2 | fail_fast | semantic/embedding tests | Lecturas idempotentes |
| L2→L3 | fail_fast | hooks/verify tests | Salida inválida no propaga |
| L3→L4 | fail_fast | gatekeeper/grill tests | Sin gate, sin exposición |
| L4→L5 | deprecate_then_remove | api tests | Frontend no rompe en silencio |
