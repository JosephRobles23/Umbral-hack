import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { loadEde, createEdeStore } from "./ede-store";
import { runMigrations } from "./migrate";
import type { Ede } from "@umbral/contracts";

const VALID_EDE: Ede = {
  id: "EDE-TEST-001",
  title: "Test decision",
  version: 1,
  status: "accepted",
  cognitiveLevel: "navigator",
  complexityTier: 2,
  whatAndHow: { decision: "Use X", mechanism: "Via Y" },
  why: {
    rationale: "Because Z is better than A.",
    alternativesConsidered: [{ option: "A", rejectedBecause: "slower" }],
    references: ["R1"],
  },
  whatNotToDo: { antiPatterns: ["Don't do W"] },
  whatsNext: { continuations: [], openQuestions: [] },
  contracts: { layerContracts: [], verifiedBy: [] },
  tests: { unitTests: [], sadPaths: [], coverageTarget: 0.8 },
  provenance: {
    phase: "design",
    slice: 1,
    createdBy: "human",
    createdAt: null,
    lastUpdated: null,
  },
};

describe("loadEde", () => {
  it("carga EDE válida", () => {
    const result = loadEde(VALID_EDE);
    expect(result.id).toBe("EDE-TEST-001");
    expect(result.why.rationale).toBe("Because Z is better than A.");
  });

  it("rechaza EDE sin rationale", () => {
    const noRationale = {
      ...VALID_EDE,
      why: { ...VALID_EDE.why, rationale: "   " },
    };
    expect(() => loadEde(noRationale)).toThrow("[S13]");
    expect(() => loadEde(noRationale)).toThrow("rationale");
  });

  it("rechaza schema inválido", () => {
    expect(() => loadEde({ id: 123 })).toThrow("[S13]");
    expect(() => loadEde({})).toThrow("[S13]");
  });
});

describe("createEdeStore", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    sqliteVec.load(db);
    runMigrations(db);
  });

  afterEach(() => {
    db.close();
  });

  it("save + getById round-trip", () => {
    const store = createEdeStore(db);
    store.save(VALID_EDE);
    const retrieved = store.getById("EDE-TEST-001");
    expect(retrieved).toEqual(VALID_EDE);
  });

  it("getAll returns saved EDEs", () => {
    const store = createEdeStore(db);
    store.save(VALID_EDE);
    const all = store.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("EDE-TEST-001");
  });

  it("getById returns null for missing", () => {
    const store = createEdeStore(db);
    expect(store.getById("nonexistent")).toBeNull();
  });
});
