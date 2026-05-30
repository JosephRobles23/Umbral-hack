import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { runMigrations } from "@umbral/persistence/src/migrate";
import { createEdeStore } from "@umbral/persistence";
import type { Ede } from "@umbral/contracts";
import { handleToolCall, TOOL_DEFINITIONS } from "./tools";

const EDE: Ede = {
  id: "EDE-TEST-001",
  title: "SQLite único",
  version: 1,
  status: "accepted",
  cognitiveLevel: "anchor",
  complexityTier: 3,
  whatAndHow: { decision: "Use SQLite single file", mechanism: "Via better-sqlite3" },
  why: {
    rationale: "Local-first, zero external deps.",
    alternativesConsidered: [{ option: "PostgreSQL", rejectedBecause: "External dependency" }],
    references: [],
  },
  whatNotToDo: {
    antiPatterns: ["No usar PostgreSQL", "No usar ORMs pesados"],
  },
  whatsNext: { continuations: [], openQuestions: [] },
  contracts: { layerContracts: ["L1->L2"], verifiedBy: [] },
  tests: { unitTests: ["db.test.ts"], sadPaths: ["corrupted-db"], coverageTarget: 0.8 },
  provenance: { phase: "design", slice: 0, createdBy: "human", createdAt: "2025-01-01", lastUpdated: "2025-01-01" },
};

const EDE2: Ede = {
  ...EDE,
  id: "EDE-TEST-002",
  title: "Grill blocking",
  status: "proposed",
  whatAndHow: { decision: "Grill blocks F2+", mechanism: "Alignment scoring" },
  why: { ...EDE.why, rationale: "Cognitive alignment required." },
  whatNotToDo: { antiPatterns: [] },
};

let db: Database.Database;

beforeEach(() => {
  db = new Database(":memory:");
  sqliteVec.load(db);
  runMigrations(db);
  const store = createEdeStore(db);
  store.save(EDE);
  store.save(EDE2);
});

afterEach(() => {
  db.close();
});

describe("TOOL_DEFINITIONS", () => {
  it("defines 7 tools", () => {
    expect(TOOL_DEFINITIONS).toHaveLength(7);
  });

  it("every tool has name, description, and inputSchema", () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
    }
  });
});

describe("umbral_ede_list", () => {
  it("lists all EDEs", () => {
    const result = handleToolCall("umbral_ede_list", {}, db) as Array<Record<string, unknown>>;
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("EDE-TEST-001");
    expect(result[1].id).toBe("EDE-TEST-002");
  });

  it("filters by status", () => {
    const result = handleToolCall("umbral_ede_list", { status: "accepted" }, db) as Array<Record<string, unknown>>;
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("EDE-TEST-001");
  });

  it("returns summary fields", () => {
    const result = handleToolCall("umbral_ede_list", {}, db) as Array<Record<string, unknown>>;
    expect(result[0]).toHaveProperty("decision");
    expect(result[0]).toHaveProperty("cognitiveLevel");
  });
});

describe("umbral_ede_get", () => {
  it("returns full EDE", () => {
    const result = handleToolCall("umbral_ede_get", { id: "EDE-TEST-001" }, db) as Ede;
    expect(result.id).toBe("EDE-TEST-001");
    expect(result.whatAndHow.decision).toBe("Use SQLite single file");
    expect(result.whatNotToDo.antiPatterns).toContain("No usar PostgreSQL");
  });

  it("returns error for missing EDE", () => {
    const result = handleToolCall("umbral_ede_get", { id: "EDE-NOPE" }, db) as { error: string };
    expect(result.error).toContain("not found");
  });
});

describe("umbral_ede_search", () => {
  it("finds EDEs by decision text", () => {
    const result = handleToolCall("umbral_ede_search", { query: "SQLite" }, db) as Array<Record<string, unknown>>;
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("EDE-TEST-001");
  });

  it("finds EDEs by title", () => {
    const result = handleToolCall("umbral_ede_search", { query: "Grill" }, db) as Array<Record<string, unknown>>;
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("EDE-TEST-002");
  });

  it("returns empty for no matches", () => {
    const result = handleToolCall("umbral_ede_search", { query: "kubernetes" }, db) as Array<Record<string, unknown>>;
    expect(result).toHaveLength(0);
  });
});

describe("umbral_context", () => {
  it("returns assembled context", () => {
    const result = handleToolCall("umbral_context", {}, db) as { context: string };
    expect(result.context).toContain("EDE-TEST-001");
    expect(result.context).toContain("Use SQLite single file");
    expect(result.context).toContain("Fail-fast");
  });
});

describe("umbral_grill_status", () => {
  it("returns null session when none active", () => {
    const result = handleToolCall("umbral_grill_status", {}, db) as {
      activeSession: null;
      cognitiveDebts: number;
    };
    expect(result.activeSession).toBeNull();
    expect(result.cognitiveDebts).toBe(0);
  });
});

describe("umbral_gate_check", () => {
  it("passes with accepted EDE and tests", () => {
    const result = handleToolCall(
      "umbral_gate_check",
      { edeId: "EDE-001", edeStatus: "accepted", unitTests: ["t1"], sadPaths: ["s1"] },
      db,
    ) as { pass: boolean };
    expect(result.pass).toBe(true);
  });

  it("fails without EDE ID", () => {
    const result = handleToolCall(
      "umbral_gate_check",
      { edeId: undefined },
      db,
    ) as { pass: boolean; gate: string };
    expect(result.pass).toBe(false);
    expect(result.gate).toBe("CodeGuard");
  });

  it("fails with non-accepted EDE", () => {
    const result = handleToolCall(
      "umbral_gate_check",
      { edeId: "EDE-001", edeStatus: "proposed" },
      db,
    ) as { pass: boolean; gate: string };
    expect(result.pass).toBe(false);
    expect(result.gate).toBe("CodeGuard");
  });
});

describe("unknown tool", () => {
  it("returns error", () => {
    const result = handleToolCall("umbral_nope", {}, db) as { error: string };
    expect(result.error).toContain("Unknown tool");
  });
});
