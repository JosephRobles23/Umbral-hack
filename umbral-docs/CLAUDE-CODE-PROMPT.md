# Prompt de arranque — Claude Code · Slice 0

> Cómo usarlo: coloca la carpeta `umbral-docs/` en la raíz donde quieres el proyecto.
> Abre Claude Code ahí (`claude`). Pega el bloque de abajo. Cuando el Slice 0 pase
> sus criterios de aceptación, repites con el prompt del Slice 1 (al final de este archivo).

---

## PROMPT — SLICE 0

```
Vas a construir el Slice 0 de Umbral, un framework de desarrollo con comprensión
sostenible. NO improvises arquitectura: toda decisión ya está tomada y documentada.

CONTEXTO OBLIGATORIO — léelo antes de escribir nada:
1. Lee `umbral-docs/README.md` (visión, decisiones congeladas, secuencia de slices).
2. Lee `umbral-docs/01-monorepo/turborepo-layout.md` (el árbol exacto del monorepo).
3. Lee `umbral-docs/phases/SLICE-00-bootstrap.md` (lo que vas a construir AHORA).
4. Lee `umbral-docs/edes/EDE-000-persistence.ede.json` y
   `umbral-docs/edes/EDE-006-vertical-slices.ede.json` (las decisiones que materializa
   este slice).

REGLAS DE TRABAJO (no negociables):
- Alcance: SOLO el Slice 0. No adelantes trabajo de slices posteriores (nada de S1,
  S7, gates, etc.). Si te dan ganas de "dejar preparado" algo de otro slice, NO lo hagas.
- Stack fijo: Turborepo + pnpm workspaces + Next.js (App Router) en apps/web +
  paquetes TS en packages/* + SQLite vía better-sqlite3 con la extensión sqlite-vec.
  No sustituyas ninguna pieza.
- Fail-fast (S13): la conexión a la DB debe FALLAR al arrancar si la extensión
  sqlite-vec no carga o si la integridad de la DB falla. Un error claro, no un fallback
  silencioso.
- Local-first: la DB es un archivo en ~/.umbral/umbral.db. Nada de servicios externos.
- Tests obligatorios: implementa los unit tests que SLICE-00 lista como criterio
  (abre DB + aplica WAL; falla al boot si sqlite-vec ausente). Usa vitest.
- No toques `umbral-docs/`: es documentación de referencia, de solo lectura.

PLAN DE EJECUCIÓN — hazlo en este orden y párate a confirmar en los checkpoints:
1. Crea el scaffolding del monorepo siguiendo turborepo-layout.md (turbo.json,
   pnpm-workspace.yaml, tsconfig.base.json, los packages/* vacíos con su package.json,
   apps/web con create-next-app).
   CHECKPOINT A: muéstrame el árbol de archivos resultante y espera mi "ok" antes de seguir.
2. Implementa packages/persistence/src/db.ts con el contrato de SLICE-00 (openDb con
   fail-fast). Implementa los migrations vacíos que necesite.
3. Escribe los unit tests de db.test.ts y haz que pasen.
   CHECKPOINT B: corre `pnpm turbo typecheck` y `pnpm turbo test`, muéstrame la salida.
4. Verifica los criterios de aceptación de SLICE-00 uno por uno y dime cuáles pasan.

CRITERIO DE "HECHO": `pnpm turbo dev` levanta apps/web en localhost:3000, openDb crea
~/.umbral/umbral.db, y el test de fail-fast (sqlite-vec ausente) pasa. Cuando todo esto
sea cierto, dímelo y NO empieces el Slice 1.

Empieza leyendo los 4 documentos y luego dame tu plan para el paso 1.
```

---

## Por qué el prompt es así (no es decoración)

- **Le doy los documentos como fuente de verdad, no la arquitectura en el prompt.** Si pego la arquitectura en el prompt, se desincroniza de `umbral-docs/`. Apuntarlo a los archivos mantiene una sola fuente (mismo principio que EDE-002).
- **Acoto el alcance a UN slice.** Es la defensa contra el vibe-coding: un agente con "construye todo Umbral" produce mucho código que nadie verificó. Un slice cerrado con criterios de aceptación es verificable.
- **Checkpoints A y B.** Te obligan a revisar antes de que acumule trabajo no comprendido. Es Grill Me aplicado a tu relación con Claude Code: engagement cognitivo en los puntos baratos.
- **"No empieces el Slice 1".** Sin esto, el agente encadena y pierdes el control de fase.

---

## Prompt para los slices siguientes (plantilla)

Para el Slice N (N≥1), reusa esta plantilla cambiando los números:

```
Construye el Slice N de Umbral. El Slice N-1 ya está terminado y verde.

CONTEXTO OBLIGATORIO:
1. Lee `umbral-docs/phases/SLICE-0N-<nombre>.md`.
2. Lee las EDEs que ese documento lista en "EDEs que materializa".
3. Lee `umbral-docs/02-contracts/layer-contracts.md` para los contratos que toca.

REGLAS: las mismas del Slice 0 (alcance a un slice, stack fijo, fail-fast, tests
obligatorios, no tocar umbral-docs/).

[A PARTIR DEL SLICE 5] Este slice debe pasar por los gatekeepers que instaló el Slice 5:
- CodeGuard: no modifiques código sin que exista la EDE aprobada de este slice.
- PlanGuard: tu plan debe incluir los unit tests antes de escribir implementación.
- CommitGuard: corre el pipeline graduado (test de impacto → dirigido → suite) antes
  de declarar el slice hecho.

Empieza leyendo los documentos y dame tu plan, separando explícitamente qué tests
escribirás ANTES de implementar (TDD, exigido por PlanGuard).
```

---

## Sobre la interfaz de chat (recordatorio)

El chat que SÍ construyes dentro de la app es el de **Grill Me** (Slice 2), no Claude Code.
Claude Code es la herramienta con la que levantas el repo desde fuera. Si en el futuro
quieres embeber Claude Code dentro de la UI de Umbral, eso es una EDE nueva (EDE-008) y un
slice nuevo — no se mezcla con lo actual.
```
