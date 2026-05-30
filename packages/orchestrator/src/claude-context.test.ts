import { describe, it, expect } from "vitest";
import type { Ede } from "@umbral/contracts";
import { assembleClaudeContext } from "./claude-context";

const EDE: Ede = {
  id: "EDE-TEST-001",
  title: "Test decision",
  version: 1,
  status: "accepted",
  cognitiveLevel: "navigator",
  complexityTier: 2,
  whatAndHow: { decision: "Use SQLite", mechanism: "Via better-sqlite3" },
  why: {
    rationale: "Local-first, no external deps.",
    alternativesConsidered: [],
    references: [],
  },
  whatNotToDo: {
    antiPatterns: ["No usar PostgreSQL", "No usar ORMs pesados"],
  },
  whatsNext: { continuations: [], openQuestions: [] },
  contracts: { layerContracts: ["L1->L2"], verifiedBy: [] },
  tests: { unitTests: [], sadPaths: [], coverageTarget: 0.8 },
  provenance: { phase: "design", slice: 1, createdBy: "human", createdAt: null, lastUpdated: null },
};

describe("assembleClaudeContext", () => {
  it("genera CLAUDE.md con decisiones activas", () => {
    const content = assembleClaudeContext([EDE]);
    expect(content).toContain("EDE-TEST-001");
    expect(content).toContain("Use SQLite");
    expect(content).toContain("Via better-sqlite3");
  });

  it("incluye anti-patterns", () => {
    const content = assembleClaudeContext([EDE]);
    expect(content).toContain("No usar PostgreSQL");
    expect(content).toContain("No usar ORMs pesados");
    expect(content).toContain("PROHIBIDO");
  });

  it("incluye contratos de capa", () => {
    const content = assembleClaudeContext([EDE]);
    expect(content).toContain("L1->L2");
  });

  it("incluye reglas generales", () => {
    const content = assembleClaudeContext([EDE]);
    expect(content).toContain("Fail-fast");
    expect(content).toContain("S13");
  });

  it("filtra EDEs no aceptadas", () => {
    const draft = { ...EDE, id: "EDE-DRAFT", status: "proposed" as const };
    const content = assembleClaudeContext([EDE, draft]);
    expect(content).toContain("EDE-TEST-001");
    expect(content).not.toContain("EDE-DRAFT");
  });

  it("genera contenido mínimo sin EDEs", () => {
    const content = assembleClaudeContext([]);
    expect(content).toContain("No hay EDEs activas");
  });
});
