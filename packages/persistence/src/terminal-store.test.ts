import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { runMigrations } from "./migrate";
import { createTerminalStore } from "./terminal-store";
import type { TerminalSession } from "@umbral/contracts";

let db: Database.Database;

const SESSION: TerminalSession = {
  id: "session-1",
  edeId: "EDE-001",
  pid: 1234,
  status: "active",
  workingDirectory: "/tmp/test",
  claudeMdPath: "/tmp/test/.claude/CLAUDE.md",
  createdAt: "2026-01-01T00:00:00Z",
  lastActivityAt: "2026-01-01T00:00:00Z",
  terminatedAt: null,
};

beforeEach(() => {
  db = new Database(":memory:");
  sqliteVec.load(db);
  runMigrations(db);
});

afterEach(() => db.close());

describe("TerminalStore", () => {
  it("save + getById round-trip", () => {
    const store = createTerminalStore(db);
    store.save(SESSION);
    const retrieved = store.getById("session-1");
    expect(retrieved).toEqual(SESSION);
  });

  it("getActive returns only active sessions", () => {
    const store = createTerminalStore(db);
    store.save(SESSION);
    store.save({ ...SESSION, id: "session-2", status: "terminated" });
    const active = store.getActive();
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe("session-1");
  });

  it("updateStatus to terminated sets terminatedAt", () => {
    const store = createTerminalStore(db);
    store.save(SESSION);
    store.updateStatus("session-1", "terminated");
    const updated = store.getById("session-1");
    expect(updated!.status).toBe("terminated");
    expect(updated!.terminatedAt).not.toBeNull();
  });

  it("getRecent respects limit", () => {
    const store = createTerminalStore(db);
    store.save(SESSION);
    store.save({ ...SESSION, id: "session-2" });
    store.save({ ...SESSION, id: "session-3" });
    const recent = store.getRecent(2);
    expect(recent).toHaveLength(2);
  });

  it("getById returns null for missing", () => {
    const store = createTerminalStore(db);
    expect(store.getById("nonexistent")).toBeNull();
  });
});
