import { describe, it, expect } from "vitest";
import { assertBoundary } from "./boundary";

describe("assertBoundary (S11)", () => {
  it("plan técnico con campo de negocio lanza", () => {
    const plan = {
      id: "tp-1",
      edeRefs: [],
      layerContracts: [],
      testStrategy: {},
      c4Snapshot: "",
      retorno: "leaked!",
    };
    expect(() => assertBoundary(plan, "technical")).toThrow("[S11]");
    expect(() => assertBoundary(plan, "technical")).toThrow("retorno");
  });

  it("plan de negocio con campo técnico lanza", () => {
    const plan = {
      id: "bp-1",
      retorno: "x",
      moat: "y",
      alineacionEstrategica: "z",
      verdict: "go",
      edeRefs: "leaked!",
    };
    expect(() => assertBoundary(plan, "business")).toThrow("[S11]");
    expect(() => assertBoundary(plan, "business")).toThrow("edeRefs");
  });

  it("plan técnico puro pasa", () => {
    const plan = {
      id: "tp-1",
      edeRefs: [],
      layerContracts: [],
      testStrategy: {},
      c4Snapshot: "",
      rationale: "",
    };
    expect(() => assertBoundary(plan, "technical")).not.toThrow();
  });

  it("plan de negocio puro pasa", () => {
    const plan = {
      id: "bp-1",
      retorno: "x",
      moat: "y",
      alineacionEstrategica: "z",
      verdict: "go",
      rationale: "",
    };
    expect(() => assertBoundary(plan, "business")).not.toThrow();
  });
});
