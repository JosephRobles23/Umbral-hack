import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { runMigrations } from "./migrate";
import { createSemanticStore } from "./semantic-store";
import type { SessionNode } from "@umbral/contracts";

const NODE: SessionNode = {
  id: "node-1",
  sessionId: "session-abc",
  type: "grill",
  content: "La persistencia local usa SQLite con FTS5 para búsqueda textual rápida",
  metadata: { score: 75 },
  sourceDocNode: "doc-ede-000",
  createdAt: "2026-01-01T00:00:00Z",
};

let db: Database.Database;

beforeEach(() => {
  db = new Database(":memory:");
  sqliteVec.load(db);
  runMigrations(db);
});

afterEach(() => db.close());

describe("SemanticStore (S7 — FTS5)", () => {
  it("indexa y recupera un SessionNode por text-search", () => {
    const store = createSemanticStore(db);
    store.index(NODE);
    const results = store.search("SQLite FTS5");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("node-1");
    expect(results[0].sourceDocNode).toBe("doc-ede-000");
  });

  it("lectura es idempotente (no muta estado)", () => {
    const store = createSemanticStore(db);
    store.index(NODE);

    const count = () =>
      (db.prepare("SELECT count(*) as c FROM session_nodes").get() as { c: number }).c;

    const before = count();
    store.search("SQLite");
    store.search("SQLite");
    expect(count()).toBe(before);
  });

  it("filtra por tipo", () => {
    const store = createSemanticStore(db);
    store.index(NODE);
    store.index({ ...NODE, id: "node-2", type: "design", content: "SQLite diseño alternativo" });

    const grillOnly = store.search("SQLite", { type: "grill" });
    expect(grillOnly).toHaveLength(1);
    expect(grillOnly[0].type).toBe("grill");
  });

  it("devuelve vacío si no hay match", () => {
    const store = createSemanticStore(db);
    store.index(NODE);
    expect(store.search("inexistente")).toHaveLength(0);
  });
});
