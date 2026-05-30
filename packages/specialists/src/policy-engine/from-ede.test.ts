import { describe, it, expect } from "vitest";
import type { Ede } from "@umbral/contracts";
import { derivePoliciesFromEde } from "./from-ede";

const EDE: Ede = {
  id: "EDE-TEST-001",
  title: "Test decision",
  version: 1,
  status: "accepted",
  cognitiveLevel: "navigator",
  complexityTier: 2,
  whatAndHow: { decision: "Use X", mechanism: "Via Y" },
  why: {
    rationale: "Because it's better.",
    alternativesConsidered: [],
    references: [],
  },
  whatNotToDo: {
    antiPatterns: [
      "No acceder a la DB directamente desde L5",
      "No usar buses de eventos asíncronos",
    ],
  },
  whatsNext: { continuations: [], openQuestions: [] },
  contracts: { layerContracts: [], verifiedBy: [] },
  tests: { unitTests: [], sadPaths: [], coverageTarget: 0.8 },
  provenance: { phase: "design", slice: 1, createdBy: "human", createdAt: null, lastUpdated: null },
};

describe("derivePoliciesFromEde", () => {
  it("genera una política por cada antiPattern", () => {
    const policies = derivePoliciesFromEde(EDE);
    expect(policies).toHaveLength(2);
  });

  it("cada política referencia la EDE de origen", () => {
    const policies = derivePoliciesFromEde(EDE);
    expect(policies.every((p) => p.sourceEdeId === "EDE-TEST-001")).toBe(true);
  });

  it("políticas derivadas son deny por defecto", () => {
    const policies = derivePoliciesFromEde(EDE);
    expect(policies.every((p) => p.rule.effect === "deny")).toBe(true);
  });

  it("ids son únicos", () => {
    const policies = derivePoliciesFromEde(EDE);
    const ids = policies.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
