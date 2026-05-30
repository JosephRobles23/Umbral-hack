import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname } from "node:path";
import { runMigrations } from "./migrate";

const DEFAULT_DB_PATH = `${homedir()}/.umbral/umbral.db`;

export function openDb(path: string = DEFAULT_DB_PATH): Database.Database {
  mkdirSync(dirname(path), { recursive: true });

  const db = new Database(path);

  try {
    sqliteVec.load(db);
  } catch (err) {
    db.close();
    throw new Error(
      `[S13] sqlite-vec extension failed to load — the app will not start. Cause: ${err instanceof Error ? err.message : err}`,
    );
  }

  db.pragma("journal_mode = WAL");

  const ok = db.pragma("integrity_check", { simple: true });
  if (ok !== "ok") {
    db.close();
    throw new Error("[S13] DB integrity check failed — the app will not start.");
  }

  runMigrations(db);

  return db;
}
