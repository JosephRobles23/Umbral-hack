# Monorepo — Layout Turborepo

Derivado de **Umbral v2.0, Parte V (local-first, Next.js)** y las decisiones congeladas.

## Decisión de stack

- **Gestor**: Turborepo + pnpm workspaces.
- **Frontend (L5)**: Next.js (App Router) en `apps/web`.
- **API/BFF (L4)**: route handlers de Next en greenfield (un solo proceso, local-first). Se extrae a `apps/api` solo si el modo acoplable lo exige.
- **Lógica (L1–L3)**: paquetes TypeScript en `packages/*`, consumibles por la app web.
- **Agentes**: la interfaz de runtime de agentes se define como contrato (L2). La decisión de motor concreto (ADK Python vs SDK TS) queda como EDE pendiente — **no la asumimos aquí**. El contrato permite ambos: un especialista expone una función que cumple su schema; cómo la implementa (TS nativo o subprocess a Python) es detalle de implementación tras su frontera.
- **Persistencia (L1)**: SQLite único con FTS5 + sqlite-vec, vía `better-sqlite3`.

> Nota local-first: todo corre en un proceso Node en el host. La DB es un archivo en `~/.umbral/umbral.db`. Nada sale a la red por defecto.

## Árbol del monorepo

```
umbral/
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .umbral/                      # estado local (gitignored): umbral.db, sesiones
│
├── apps/
│   └── web/                      # L5 + L4 — Next.js (App Router)
│       ├── app/
│       │   ├── (war-room)/       # estética War Room: planta de operativos
│       │   ├── api/              # L4 route handlers (BFF)
│       │   └── layout.tsx
│       ├── components/
│       │   ├── operatives/       # discos de operativo (especialistas)
│       │   ├── c4-viewer/        # S6 — visor C4 que escucha C4RegenTrigger
│       │   ├── grill/            # S1 — panel Grill Me
│       │   └── debt-meter/       # CDR de F4
│       └── package.json
│
├── packages/
│   ├── contracts/                # tipos compartidos (todas las interfaces de v2)
│   │   ├── src/
│   │   │   ├── ede.ts            # EDE schema
│   │   │   ├── layers.ts        # LayerContract, invariants
│   │   │   ├── grill.ts        # GrillSession, GrillQuestion (S1)
│   │   │   ├── doc-regen.ts    # DocRegenEvent, DocNode (S2)
│   │   │   ├── c4.ts           # C4Model, C4RegenTrigger (S6)
│   │   │   ├── semantic.ts     # SessionNode, SemanticSessionStore (S7)
│   │   │   ├── embeddings.ts   # DocChunk, DocEmbeddingIndex (S8)
│   │   │   ├── evidence.ts     # ComprehensionSignal + adaptador (S9/S10→F4)
│   │   │   ├── policy.ts       # Policy, PolicyDecision, DSL (S4)
│   │   │   ├── plans.ts        # BusinessPlan, TechnicalPlan (S11)
│   │   │   └── gates.ts        # Gatekeeper, TestPlan (S12)
│   │   └── package.json
│   │
│   ├── persistence/              # L1 — SQLite único
│   │   ├── src/
│   │   │   ├── db.ts            # conexión better-sqlite3, fail-fast al boot (S13)
│   │   │   ├── migrations/
│   │   │   ├── ede-store.ts     # CRUD de .ede.json indexadas
│   │   │   ├── semantic-store.ts# S7 — FTS5
│   │   │   └── embedding-index.ts# S8 — sqlite-vec
│   │   └── package.json
│   │
│   ├── specialists/              # L2
│   │   ├── src/
│   │   │   ├── runtime.ts       # contrato de runtime de agente (motor-agnóstico)
│   │   │   ├── plan-generator/  # S11
│   │   │   ├── policy-engine/   # S4 — intérprete del DSL JSON
│   │   │   └── adapters/        # S9 Langfuse, S10 DevTools → ComprehensionSignal
│   │   └── package.json
│   │
│   ├── orchestrator/             # L3
│   │   ├── src/
│   │   │   ├── hooks.ts         # S3 — HookRegistry, 4 puntos de extensión
│   │   │   ├── phases/          # F0–F5: lógica de cada fase
│   │   │   ├── gates/           # S12 — CodeGuard, PlanGuard, CommitGuard
│   │   │   └── grill.ts         # S1 — motor de alineación
│   │   └── package.json
│   │
│   └── config/                   # tsconfig, eslint, fail-fast de config (S13)
│       └── ...
│
└── tooling/
    ├── eslint-config/
    └── tsconfig/
```

## turbo.json (pipeline)

```jsonc
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build":  { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "dev":    { "cache": false, "persistent": true },
    "test":   { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "lint":   {},
    "typecheck": { "dependsOn": ["^build"] },
    // Gatekeepers (S12) como tareas de pipeline, a partir del Slice 5:
    "gate:plan":   { "dependsOn": ["typecheck"] },   // PlanGuard
    "gate:commit": { "dependsOn": ["test", "lint"] } // CommitGuard graduado
  }
}
```

## Por qué un solo SQLite (EDE-000)

FTS5 (text-search de S7) y sqlite-vec (embeddings de S8) coexisten en el mismo archivo `.db`. Ventajas para local-first:

- Una sola conexión, una sola transacción — un cambio de doc puede actualizar índice de texto **y** vectorial atómicamente, lo que respeta el principio de fuente única (EDE-002).
- Cero servicios externos que levantar: coherente con "primero corre localmente".
- Backup = copiar un archivo.

Trade-off aceptado (registrado en EDE-000): sqlite-vec escala peor que un vector store dedicado a millones de chunks. Para el uso objetivo (un proyecto, un equipo pequeño) es suficiente. Si se supera, la frontera de `embedding-index.ts` permite cambiar el backend sin tocar S8 arriba.
