# EDEs — Especificaciones de Decisión de Equipo

Cada `.ede.json` captura una decisión con su razonamiento, sus anti-patrones y sus tests. Es el artefacto vivo central de Umbral (v2, Fase 2).

## Las 8 EDEs base

Estas se tomaron antes de construir y gobiernan todo el plan. Se referencian desde la prosa por su `id`, nunca se duplican (EDE-003).

| id | Decisión | Slice |
|----|----------|:-----:|
| `EDE-000-persistence` | SQLite único FTS5 + sqlite-vec | 0 |
| `EDE-001-pac-dsl` | DSL JSON propio para PaC | 7 |
| `EDE-002-change-source` | S2 única fuente de cambios | 4 |
| `EDE-003-ede-format` | EDEs como `.ede.json` separados | 1 |
| `EDE-004-evidence-adapter` | Adaptadores → ComprehensionSignal | 6 |
| `EDE-005-grill-blocking` | Grill Me bloquea con override+deuda | 2 |
| `EDE-006-vertical-slices` | Construir por slices verticales | 0 |
| `EDE-007-self-governance` | Bootstrap manual → dogfooding | 5 |

## Estructura de una EDE (los 4 componentes de v2)

Comprime los 7 componentes del AKU de Bakal en 4, estratificados por `complexityTier` (1=Explorer, 2=Navigator, 3=Anchor):

1. **`whatAndHow`** — Qué se decidió y cómo funciona.
2. **`why`** — Por qué (ADR integrado: rationale + alternativas rechazadas + referencias). Captura el razonamiento, no solo la conclusión.
3. **`whatNotToDo`** — Anti-patrones. Alimenta el motor PaC (S4).
4. **`whatsNext`** — Continuaciones y preguntas abiertas.

Más: `contracts` (qué LayerContract toca + tests que lo verifican) y `tests` (unitarios obligatorios + sad-paths).

## Cómo crear una EDE nueva

```bash
cp templates/ede.template.json edes/EDE-0XX-mi-decision.ede.json
# editar; el schema se valida al cargar (fail-fast S13)
# desde el Slice 1, ede-store.ts la indexa en la DB
```

## Regla de oro

Una EDE sin el campo `why.rationale` poblado no es una EDE: es una conclusión sin razonamiento, exactamente la deuda cognitiva que Umbral existe para prevenir.
