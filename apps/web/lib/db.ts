import { openDb, createEdeStore, createGrillStore, createTerminalStore } from "@umbral/persistence";

let _db: ReturnType<typeof openDb> | null = null;

function getDb() {
  if (!_db) _db = openDb();
  return _db;
}

export function getEdeStore() {
  return createEdeStore(getDb());
}

export function getGrillStore() {
  return createGrillStore(getDb());
}

export function getTerminalStore() {
  return createTerminalStore(getDb());
}
