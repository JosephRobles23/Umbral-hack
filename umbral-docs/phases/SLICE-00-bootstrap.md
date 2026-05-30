# SLICE 0 — Bootstrap del Monorepo

> **Cimiento, no slice vertical.** No produce comprensión todavía; produce el suelo sobre el que todo lo demás corre. Bootstrap manual (EDE-007).

## Objetivo

`turbo dev` levanta una web Next.js vacía y la conexión SQLite arranca con fail-fast. Estado "hecho": el comando corre, la web responde en `localhost:3000`, y la DB se crea (o falla limpio si no puede).

## EDEs que materializa

`EDE-000-persistence`, `EDE-006-vertical-slices`.

## Scaffolding

```bash
# 1. Crear el monorepo
pnpm dlx create-turbo@latest umbral --package-manager pnpm
cd umbral

# 2. Workspaces (pnpm-workspace.yaml)
cat > pnpm-workspace.yaml << 'YAML'
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
YAML

# 3. Paquetes vacíos con sus package.json
mkdir -p packages/{contracts,persistence,specialists,orchestrator,config}/src
mkdir -p apps/web

# 4. App Next.js
cd apps && pnpm dlx create-next-app@latest web --ts --app --no-src-dir --import-alias "@/*"
cd ..

# 5. Persistencia: dependencia base
pnpm --filter @umbral/persistence add better-sqlite3 sqlite-vec
pnpm --filter @umbral/persistence add -D @types/better-sqlite3
```

## Archivos clave a crear

`packages/persistence/src/db.ts` — conexión con **fail-fast al boot** (S13):

```ts
// Pseudoimplementación — el contrato, no la versión final.
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";

export function openDb(path = `${process.env.HOME}/.umbral/umbral.db`): Database.Database {
  const db = new Database(path);              // crea el archivo si no existe
  sqliteVec.load(db);                          // si la extensión falta → throw (fail-fast)
  db.pragma("journal_mode = WAL");
  // verifica integridad mínima; si la DB está corrupta, NO arrancamos:
  const ok = db.pragma("integrity_check", { simple: true });
  if (ok !== "ok") throw new Error("[S13] DB corrupta: la app no arranca.");
  return db;
}
```

`turbo.json` — pipeline base (ver `01-monorepo/turborepo-layout.md`).

## Criterios de aceptación

- [ ] `pnpm install` instala sin errores.
- [ ] `pnpm turbo dev` levanta `apps/web` en `localhost:3000`.
- [ ] `openDb()` crea `~/.umbral/umbral.db` en primera ejecución.
- [ ] `openDb()` lanza error claro si la extensión sqlite-vec no carga (fail-fast verificado).
- [ ] `pnpm turbo typecheck` pasa en todos los paquetes.

## Tests (S12 — unitarios obligatorios)

`packages/persistence/src/db.test.ts`:
- `abre DB y aplica WAL` — abre, verifica pragma.
- `falla al boot si sqlite-vec ausente` — mock de carga fallida → espera throw.

## Exit condition

La web vacía corre y la DB arranca con fail-fast verificado por test. **No avanzar al Slice 1 si `turbo dev` no levanta limpio.**
