# Umbral — Documentación Técnica de Arranque

> Plan de construcción autoincremental por slices verticales, desde el bootstrap del monorepo hasta la auto-gobernanza. Derivado de **Umbral v2.0**.

Esta documentación es el plan técnico (no de negocio — ver S11) para construir Umbral. Está pensada para dos modos de uso:

- **Greenfield** — clonas este monorepo y arrancas un proyecto nuevo dentro de él.
- **Acoplable** — apuntas Umbral a un repo existente y lo instrumenta sin tomar su estructura.

La v1 de esta documentación prioriza **greenfield**; el modo acoplable se habilita en el Slice 5 (cuando existen los contratos de capa S5 que permiten observar un repo externo sin invadirlo).

---

## Decisiones congeladas (EDEs base del proyecto)

Estas decisiones se tomaron antes de escribir una línea y gobiernan todo el plan. Cada una vive como una EDE base en `edes/`.

| Tema | Decisión | EDE |
|------|----------|-----|
| Persistencia | SQLite único: FTS5 (S7) + sqlite-vec (S8) en el mismo archivo | `EDE-000-persistence` |
| PaC (S4) | DSL propio en JSON declarativo, sin dependencia externa | `EDE-001-pac-dsl` |
| Detección de cambios | S2 es la única fuente; S6/S8 reaccionan a `DocRegenEvent` | `EDE-002-change-source` |
| Formato EDE | Archivos `.ede.json` separados; el `.md` los referencia | `EDE-003-ede-format` |
| Evidencia F4 | Capa de adaptadores → `ComprehensionSignal`; F4 no conoce S9/S10 | `EDE-004-evidence-adapter` |
| Grill Me (S1) | Bloqueante con override explícito que registra deuda | `EDE-005-grill-blocking` |
| Orden de build | Slices verticales end-to-end (L1→L5) | `EDE-006-vertical-slices` |
| Auto-gobernanza | Bootstrap manual hasta S12/S5; luego dogfooding | `EDE-007-self-governance` |

---

## Secuencia de slices

El desarrollo es autoincremental: cada slice deja la app **corriendo y verificable** antes de empezar el siguiente. Ningún slice deja la base en estado roto.

| Slice | Nombre | Qué deja funcionando | Capas | Subsistemas |
|-------|--------|---------------------|-------|-------------|
| **0** | Bootstrap monorepo | `turbo dev` levanta web vacía + DB | infra | — |
| **1** | EDE viva end-to-end | Crear/leer una EDE: DB → API → UI War Room | L1→L5 | S5 (mínimo), S13 |
| **2** | Grill Me | Sesión de alineación que bloquea/override con deuda | L2→L5 | S1, S3 |
| **3** | Memoria | Capa semántica + embeddings sobre SQLite | L1→L2 | S7, S8 |
| **4** | Doc viva + C4 | Cambio → DocRegenEvent → C4 re-renderiza en UI | L1→L5 | S2, S6 |
| **5** | Auto-gobernanza | Contratos de capa + gatekeepers; Umbral se autoaplica | L3→L5 | S5, S12 |
| **6** | Observabilidad | Adaptadores Langfuse + DevTools → ComprehensionSignal | L2→L3 | S9, S10 |
| **7** | PaC | Motor de políticas DSL evaluado en runtime | L2→L3 | S4 |
| **8** | Planes téc≠neg | Generador con invariante de frontera | L2→L4 | S11 |

> Slices 0–4 son **bootstrap manual** (Umbral aún no se gobierna a sí mismo).
> A partir del Slice 5, cada slice nuevo debe pasar por los gatekeepers que el propio Slice 5 instaló: **dogfooding**.

---

## Cómo leer cada documento de fase

Cada `phases/SLICE-XX.md` sigue el mismo esquema, alineado con la EDE de Umbral:

1. **Objetivo** — qué deja funcionando (criterio de "hecho").
2. **Contratos que toca** — qué interfaces de v2 implementa o consume.
3. **Scaffolding** — archivos/carpetas a crear y comandos exactos.
4. **Criterios de aceptación** — checklist verificable.
5. **Tests** — los unit tests obligatorios (S12) de este slice.
6. **Exit condition** — qué debe ser cierto para pasar al siguiente slice.

---

## Estructura de esta documentación

```
umbral-docs/
├── README.md                  ← este archivo
├── 00-overview/
│   └── architecture.md        ← las 5 capas, mapa subsistema↔slice
├── 01-monorepo/
│   └── turborepo-layout.md     ← árbol completo del monorepo
├── 02-contracts/
│   └── layer-contracts.md      ← contratos L1↔L5 implementables (de v2 Parte IV)
├── edes/
│   ├── EDE-000-persistence.ede.json
│   ├── ... (las 8 EDEs base)
│   └── README.md               ← cómo se escribe una EDE
├── phases/
│   ├── SLICE-00-bootstrap.md
│   ├── SLICE-01-ede-end-to-end.md
│   ├── SLICE-02-grill-me.md
│   └── ... (hasta SLICE-08)
└── templates/
    └── ede.template.json        ← plantilla para nuevas EDEs
```

---

## Arranque rápido (greenfield)

```bash
# 1. Bootstrap (Slice 0)
pnpm dlx create-turbo@latest umbral
cd umbral
# seguir phases/SLICE-00-bootstrap.md

# 2. Cada slice posterior:
#    leer phases/SLICE-XX.md → ejecutar scaffolding → pasar criterios → tests verdes → siguiente
```
