import { describe, it, expect, vi } from "vitest";
import type { GateContext } from "@umbral/contracts";
import { codeGuard } from "./code-guard";
import { planGuard } from "./plan-guard";
import { createCommitGuard, runGraduatedPipeline } from "./commit-guard";
import type { StageRunner } from "./commit-guard";

describe("CodeGuard (coercivo)", () => {
  it("bloquea modificación sin EDE", () => {
    const result = codeGuard.evaluate({});
    expect(result.pass).toBe(false);
    expect(result.reason).toContain("[S12]");
    expect(result.reason).toContain("sin EDE");
  });

  it("bloquea EDE no aprobada", () => {
    const result = codeGuard.evaluate({ edeId: "EDE-001", edeStatus: "draft" });
    expect(result.pass).toBe(false);
    expect(result.reason).toContain("no está aprobada");
  });

  it("permite EDE aprobada", () => {
    const result = codeGuard.evaluate({ edeId: "EDE-001", edeStatus: "accepted" });
    expect(result.pass).toBe(true);
  });

  it("mode es coercive", () => {
    expect(codeGuard.mode).toBe("coercive");
  });
});

describe("PlanGuard (normativo)", () => {
  it("rechaza plan ausente", () => {
    const result = planGuard.evaluate({});
    expect(result.pass).toBe(false);
    expect(result.reason).toContain("Plan ausente");
  });

  it("rechaza plan sin unitTests", () => {
    const ctx: GateContext = {
      plan: { unitTests: [], sadPaths: ["error handling"], coverageTarget: 0.8 },
    };
    const result = planGuard.evaluate(ctx);
    expect(result.pass).toBe(false);
    expect(result.reason).toContain("sin tests unitarios");
  });

  it("rechaza plan sin sadPaths", () => {
    const ctx: GateContext = {
      plan: { unitTests: ["test1"], sadPaths: [], coverageTarget: 0.8 },
    };
    const result = planGuard.evaluate(ctx);
    expect(result.pass).toBe(false);
    expect(result.reason).toContain("sin sad-paths");
  });

  it("aprueba plan completo", () => {
    const ctx: GateContext = {
      plan: { unitTests: ["test1"], sadPaths: ["error1"], coverageTarget: 0.8 },
    };
    const result = planGuard.evaluate(ctx);
    expect(result.pass).toBe(true);
  });

  it("mode es normative", () => {
    expect(planGuard.mode).toBe("normative");
  });
});

describe("CommitGuard (adaptativo)", () => {
  it("ejecuta pipeline graduado en orden: impact → directed → full", () => {
    const order: string[] = [];
    const runner: StageRunner = (stage) => {
      order.push(stage);
      return { stage, pass: true };
    };

    const guard = createCommitGuard(runner);
    const result = guard.evaluate({ impactedFiles: ["file.ts"] });

    expect(result.pass).toBe(true);
    expect(order).toEqual(["impact", "directed", "full"]);
  });

  it("se detiene en la primera etapa que falla", () => {
    const order: string[] = [];
    const runner: StageRunner = (stage) => {
      order.push(stage);
      if (stage === "directed") {
        return { stage, pass: false, reason: "[S12] Tests dirigidos fallaron" };
      }
      return { stage, pass: true };
    };

    const guard = createCommitGuard(runner);
    const result = guard.evaluate({ impactedFiles: ["file.ts"] });

    expect(result.pass).toBe(false);
    expect(result.reason).toContain("Tests dirigidos fallaron");
    expect(order).toEqual(["impact", "directed"]);
  });

  it("rechaza sin archivos impactados", () => {
    const runner: StageRunner = (stage) => ({ stage, pass: true });
    const guard = createCommitGuard(runner);
    const result = guard.evaluate({ impactedFiles: [] });
    expect(result.pass).toBe(false);
  });

  it("mode es adaptive", () => {
    const runner: StageRunner = (stage) => ({ stage, pass: true });
    const guard = createCommitGuard(runner);
    expect(guard.mode).toBe("adaptive");
  });
});

describe("Transición sin gate aprobado", () => {
  it("todos los guards rechazan contexto vacío", () => {
    const emptyCtx: GateContext = {};
    expect(codeGuard.evaluate(emptyCtx).pass).toBe(false);
    expect(planGuard.evaluate(emptyCtx).pass).toBe(false);
  });
});
