import { describe, it, expect } from "vitest";
import { createTechnicalPlan } from "./technical";

describe("createTechnicalPlan", () => {
  it("crea plan técnico válido", () => {
    const plan = createTechnicalPlan({
      edeRefs: ["EDE-001"],
      layerContracts: ["L1->L2"],
      unitTests: ["test-1"],
      sadPaths: ["error-1"],
      coverageTarget: 0.8,
      c4Snapshot: "snapshot-v1",
    });

    expect(plan.edeRefs).toEqual(["EDE-001"]);
    expect(plan.testStrategy.unitTests).toEqual(["test-1"]);
    expect(plan.rationale).toContain("1 EDEs");
  });

  it("rechaza plan sin unitTests (S13 + PlanGuard)", () => {
    expect(() =>
      createTechnicalPlan({
        edeRefs: ["EDE-001"],
        layerContracts: [],
        unitTests: [],
        sadPaths: [],
        coverageTarget: 0.8,
        c4Snapshot: "",
      }),
    ).toThrow("[S13]");
  });
});
