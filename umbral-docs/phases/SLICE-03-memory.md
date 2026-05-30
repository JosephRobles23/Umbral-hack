# SLICE 3 — Memoria (Capa Semántica + Embeddings)

> La memoria inter-sesión. Sin esto, cada sesión empieza desde cero y el agente reincide en el Context Rot Cycle. Bootstrap manual (EDE-007).

## Objetivo
Sobre el SQLite único: S7 (text-search de JSON de sesiones vía FTS5) y S8 (embeddings de docs vía sqlite-vec). Exponer S7 como **tool que el agente usa** para leer sesiones pasadas.

## EDEs que materializa
`EDE-000-persistence`. Introduce `S7` y `S8`.

## Contratos que toca
- **L1→L2**: `search` y `query` idempotentes, sin mutación; todo nodo trae trazabilidad a su `DocNode`.

## Scaffolding
```
packages/contracts/src/semantic.ts    # SessionNode, SemanticSessionStore (S7)
packages/contracts/src/embeddings.ts  # DocChunk, DocEmbeddingIndex (S8)
packages/persistence/src/semantic-store.ts    # FTS5
packages/persistence/src/embedding-index.ts   # sqlite-vec
packages/persistence/src/migrations/002_fts5_vec.sql
packages/specialists/src/runtime.ts    # registra readPastSessions como tool
```

## Distinción clave (no confundir S7 y S8)
- **S7**: JSON estructurado de sesiones, text-search exacto sobre el grafo de decisiones. Rápido.
- **S8**: documentación en lenguaje natural, búsqueda semántica difusa por embeddings, "debajo del capó".

## Archivo clave — la tool del agente (S7)
```ts
// El agente la invoca para reducir tiempo leyendo sesiones pasadas (v2 S7).
export const readPastSessions: AgentTool = {
  name: "readPastSessions",
  run: (query: string, filters?) => semanticStore.search(query, filters), // FTS5, sin mutación
};
```

## Criterios de aceptación
- [ ] Un SessionNode se indexa y se recupera por text-search (FTS5).
- [ ] Un DocChunk se indexa y se recupera por similitud (sqlite-vec).
- [ ] `readPastSessions` está disponible como tool del agente.
- [ ] Ambos índices coexisten en el mismo archivo `.db`.

## Tests (S12)
- `semantic-store.test.ts`: index + search; lectura idempotente.
- `embedding-index.test.ts`: upsert + query top-k; purga de chunk huérfano.

## Exit condition
El agente puede consultar memoria de sesiones previas. La base para que S2/S4/S9 lean contexto persistente existe.
