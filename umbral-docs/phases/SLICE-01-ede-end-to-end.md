# SLICE 1 — EDE Viva End-to-End

> **El primer slice vertical de verdad.** Toca L1→L5 con el artefacto más central de Umbral: la EDE. Si los contratos entre capas están mal, se descubre aquí. Bootstrap manual (EDE-007).

## Objetivo

Crear una `.ede.json`, validarla, persistirla en la DB, exponerla por la API y verla renderizada en el frontend con estética War Room. Flujo completo: archivo → L1 → L4 → L5.

## EDEs que materializa

`EDE-003-ede-format`. Establece el mínimo de `S5` (un LayerContract real) y `S13` (validación fail-fast del schema).

## Contratos que toca

- **L1→L2**: `ede-store` expone lectura idempotente, devuelve la EDE con trazabilidad.
- **L4→L5**: la API expone un contrato versionado `GET /api/edes` / `GET /api/edes/:id`.

## Scaffolding

```bash
# Contratos: definir el tipo EDE (de v2 Fase 2)
#   packages/contracts/src/ede.ts

# Persistencia: store de EDEs + validación de schema
#   packages/persistence/src/ede-store.ts
#   packages/persistence/src/migrations/001_edes.sql

# API (L4): route handlers en Next
#   apps/web/app/api/edes/route.ts
#   apps/web/app/api/edes/[id]/route.ts

# Frontend (L5): War Room mínimo — un operativo "EDE" en la planta
#   apps/web/app/(war-room)/page.tsx
#   apps/web/components/operatives/EdeCard.tsx
```

## Archivos clave

`packages/contracts/src/ede.ts` — el tipo que TODAS las capas comparten:

```ts
export type CognitiveLevel = "explorer" | "navigator" | "anchor";
export interface Ede {
  id: string;
  title: string;
  version: number;
  status: "proposed" | "accepted" | "deprecated";
  cognitiveLevel: CognitiveLevel;
  complexityTier: 1 | 2 | 3;
  whatAndHow: { decision: string; mechanism: string };
  why: { rationale: string; alternativesConsidered: { option: string; rejectedBecause: string }[]; references: string[] };
  whatNotToDo: { antiPatterns: string[] };
  whatsNext: { continuations: string[]; openQuestions: string[] };
  contracts: { layerContracts: string[]; verifiedBy: string[] };
  tests: { unitTests: string[]; sadPaths: string[]; coverageTarget: number };
  provenance: { phase: string; slice: number | null; createdBy: string; createdAt: string | null; lastUpdated: string | null };
}
```

`packages/persistence/src/ede-store.ts` — validación fail-fast (S13):

```ts
// Carga, valida contra el schema, indexa. Si no valida → throw (no se persiste basura).
export function loadEde(json: unknown): Ede {
  const result = edeSchema.safeParse(json);          // zod o ajv
  if (!result.success) throw new Error(`[S13] EDE inválida: ${result.error}`);
  // INVARIANTE EDE-003: why.rationale no puede estar vacío.
  if (!result.data.why.rationale.trim()) throw new Error("[S13] EDE sin rationale no es una EDE.");
  return result.data;
}
```

## Criterios de aceptación

- [ ] Una `.ede.json` válida (ej. `EDE-000`) se carga e indexa sin error.
- [ ] Una `.ede.json` sin `why.rationale` es **rechazada** (fail-fast).
- [ ] `GET /api/edes` devuelve la lista; `GET /api/edes/:id` devuelve una.
- [ ] El frontend muestra al menos una EDE como "operativo" en la planta War Room (disco, placa, estado).
- [ ] El contrato L4→L5 está documentado y respaldado por un test.

## Tests (S12)

- `ede-store.test.ts`: carga EDE válida; rechaza EDE sin rationale (sad-path); rechaza schema inválido (sad-path).
- `api/edes.test.ts`: la respuesta cumple el contrato L4→L5.

## Exit condition

Abrir el navegador y ver una EDE real, leída de la DB, renderizada en la planta. El camino L1→L5 está probado. **Este es el momento en que los contratos de capa dejan de ser teoría.**
