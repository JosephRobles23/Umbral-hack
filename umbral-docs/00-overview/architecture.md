# Arquitectura — Las 5 Capas y el Mapa de Construcción

Derivado de **Umbral v2.0, Parte IV y V**. Este documento es la referencia estructural que todos los slices respetan.

## Las 5 capas

```
┌─────────────────────────────────────────────────────────┐
│  L5  Frontend (Next.js) — War Room UI, visor C4, paneles │
│      apps/web                                            │
├─────────────────────────────────────────────────────────┤
│  L4  API / BFF — contratos de datos hacia el frontend     │
│      apps/api  (o Next route handlers en greenfield)      │
├─────────────────────────────────────────────────────────┤
│  L3  Orquestación — hooks (S3), gatekeepers (S12),        │
│      pipeline de contexto, lógica de fases (F0–F5)        │
│      packages/orchestrator                                │
├─────────────────────────────────────────────────────────┤
│  L2  Especialistas — PaC (S4), Langfuse (S9), DevTools    │
│      (S10), generador de planes (S11), adaptadores        │
│      packages/specialists                                 │
├─────────────────────────────────────────────────────────┤
│  L1  Persistencia — capa semántica (S7), embeddings (S8), │
│      EDEs, C4 (S6). SQLite único (FTS5 + sqlite-vec).     │
│      packages/persistence                                 │
└─────────────────────────────────────────────────────────┘
```

## Invariantes de capa (resumen ejecutable)

Cada invariante se verifica con un test unitario (S12). Si se viola, falla en build (S13).

- **L1→L2**: lecturas idempotentes, sin mutación. Todo nodo devuelto trae trazabilidad a su `DocNode`. Ningún especialista escribe en persistencia salvo vía `DocRegenEvent` (S2).
- **L2→L3**: toda salida de especialista valida contra un schema versionado antes de propagar. Salida inválida → rechazada en `post_response_validation`, nunca llega a L4.
- **L3→L4**: toda transición de fase pasó por sus gatekeepers (S12). El BFF nunca expone un artefacto que no superó `Gatekeeper.evaluate`.
- **L4→L5**: contratos versionados. Cambio breaking → `deprecate_then_remove`. Cambio interno → `fail_fast`.

## Principio de la fuente única de cambios (EDE-002)

```
        cambio en servicio/contrato/schema
                      │
                      ▼
              ┌──────────────┐
              │  S2 detecta  │  ← ÚNICA fuente de verdad
              │ DocRegenEvent│
              └──────┬───────┘
                     │  publica el evento
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      ┌───────┐  ┌───────┐  ┌────────┐
      │  S6   │  │  S8   │  │  S5    │
      │  C4   │  │ embed │  │contrato│
      └───────┘  └───────┘  └────────┘
   (re-proyecta) (re-indexa) (re-verifica)
```

S6, S8 y la re-verificación de contratos **nunca detectan cambios por su cuenta**. Solo reaccionan al `DocRegenEvent` de S2. Esto elimina el drift entre proyecciones.

## Mapa subsistema → slice

| Subsistema | Slice donde nace | Slice donde madura |
|-----------|:----------------:|:------------------:|
| S5 contratos | 1 (mínimo) | 5 (completo) |
| S13 fail-fast | 1 | transversal |
| S1 Grill Me | 2 | 2 |
| S3 hooks | 2 | 5 |
| S7 semántica | 3 | 3 |
| S8 embeddings | 3 | 4 (acoplado a S2) |
| S2 doc regen | 4 | 4 |
| S6 C4 | 4 | 4 |
| S12 gatekeepers | 5 | 5 |
| S9 Langfuse | 6 | 6 |
| S10 deb-log | 6 | 6 |
| S4 PaC | 7 | 7 |
| S11 planes | 8 | 8 |

## Mapa estética War Room → concepto Umbral (L5)

Portado a Next.js (la referencia Hermes está en Nuxt; se porta la estética, no el código).

| Elemento War Room | Concepto Umbral |
|-------------------|-----------------|
| Operativos en la planta | Especialistas L2 (S4, S9, S10, S11) con estado en vivo |
| Control de misión / Chat | Articulación F1 + sesión Grill Me (S1) |
| Tablero kanban | Transiciones de fase con sus gatekeepers (S12) |
| Drill-down de operativo | Salida de cada especialista + trazas (S9) + deb-log (S10) |
| Panel propio nuevo | Visor C4 (S6) + medidor de deuda cognitiva (CDR de F4) |
| SSE por misión | SSE por sesión: razonamiento / tool-call / done |
