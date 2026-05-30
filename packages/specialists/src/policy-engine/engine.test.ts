import { describe, it, expect } from "vitest";
import type { Policy, SystemAction, EvalContext } from "@umbral/contracts";
import { evaluate, validatePolicy } from "./engine";

const CTX: EvalContext = {
  actor: "developer",
  environment: "development",
  timestamp: "2026-01-01T00:00:00Z",
};

const DENY_POLICY: Policy = {
  id: "pol-1",
  name: "No direct DB access",
  description: "Prohibit direct database access from L5",
  rule: {
    subject: "L5",
    condition: { field: "action.type", operator: "equals", value: "db_query" },
    effect: "deny",
  },
};

const ALLOW_POLICY: Policy = {
  id: "pol-2",
  name: "Allow reads",
  description: "Allow read operations",
  rule: {
    subject: "any",
    condition: { field: "action.type", operator: "equals", value: "read" },
    effect: "allow",
  },
};

const APPROVAL_POLICY: Policy = {
  id: "pol-3",
  name: "Require approval for prod",
  description: "Require approval for production changes",
  rule: {
    subject: "any",
    condition: { field: "environment", operator: "equals", value: "production" },
    effect: "require_approval",
  },
};

describe("evaluate", () => {
  it("permite por defecto si ninguna política aplica", () => {
    const action: SystemAction = { type: "unknown", target: "x" };
    const result = evaluate([DENY_POLICY], action, CTX);
    expect(result.effect).toBe("allow");
    expect(result.matchedPolicies).toHaveLength(0);
  });

  it("deniega cuando una política deny aplica", () => {
    const action: SystemAction = { type: "db_query", target: "users" };
    const result = evaluate([DENY_POLICY, ALLOW_POLICY], action, CTX);
    expect(result.effect).toBe("deny");
    expect(result.matchedPolicies).toContain("pol-1");
  });

  it("require_approval cuando aplica", () => {
    const action: SystemAction = { type: "deploy", target: "api" };
    const prodCtx: EvalContext = { ...CTX, environment: "production" };
    const result = evaluate([APPROVAL_POLICY], action, prodCtx);
    expect(result.effect).toBe("require_approval");
  });

  it("deny tiene prioridad sobre require_approval", () => {
    const action: SystemAction = { type: "db_query", target: "x" };
    const prodCtx: EvalContext = { ...CTX, environment: "production" };
    const result = evaluate([DENY_POLICY, APPROVAL_POLICY], action, prodCtx);
    expect(result.effect).toBe("deny");
  });

  it("soporta operador contains", () => {
    const policy: Policy = {
      id: "pol-contains",
      name: "Block persistence writes",
      description: "",
      rule: {
        subject: "any",
        condition: { field: "action.target", operator: "contains", value: "persistence" },
        effect: "deny",
      },
    };
    const action: SystemAction = { type: "write", target: "packages/persistence/db.ts" };
    const result = evaluate([policy], action, CTX);
    expect(result.effect).toBe("deny");
  });

  it("soporta operador matches (regex)", () => {
    const policy: Policy = {
      id: "pol-regex",
      name: "Block test files",
      description: "",
      rule: {
        subject: "any",
        condition: { field: "action.target", operator: "matches", value: "\\.test\\.ts$" },
        effect: "require_approval",
      },
    };
    const action: SystemAction = { type: "edit", target: "src/foo.test.ts" };
    const result = evaluate([policy], action, CTX);
    expect(result.effect).toBe("require_approval");
  });
});

describe("validatePolicy", () => {
  it("acepta política válida", () => {
    expect(() => validatePolicy(DENY_POLICY)).not.toThrow();
  });

  it("rechaza política sin id (fail-fast S13)", () => {
    const bad = { ...DENY_POLICY, id: "" };
    expect(() => validatePolicy(bad)).toThrow("[S13]");
  });

  it("rechaza condición incompleta", () => {
    const bad: Policy = {
      ...DENY_POLICY,
      rule: { ...DENY_POLICY.rule, condition: { field: "", operator: "equals", value: "" } },
    };
    expect(() => validatePolicy(bad)).toThrow("[S13]");
  });
});
