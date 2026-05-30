import { describe, it, expect } from "vitest";
import type { Ede } from "@umbral/contracts";
import { dispatchHook } from "./hook-dispatch";

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

describe("dispatchHook", () => {
  describe("SessionStart", () => {
    it("returns context with assembled EDE info", () => {
      const result = dispatchHook(
        { hookEventName: "SessionStart", source: "startup" },
        [EDE],
      );
      expect(result.action).toBe("context");
      expect(result.context).toContain("EDE-TEST-001");
      expect(result.context).toContain("Use SQLite");
    });

    it("returns minimal context when no EDEs", () => {
      const result = dispatchHook(
        { hookEventName: "SessionStart", source: "startup" },
        [],
      );
      expect(result.action).toBe("context");
      expect(result.context).toContain("No hay EDEs activas");
    });
  });

  describe("PreToolUse", () => {
    it("allows non-file tools", () => {
      const result = dispatchHook(
        { hookEventName: "PreToolUse", toolName: "Bash", toolInput: { command: "ls" } },
        [EDE],
      );
      expect(result.action).toBe("allow");
    });

    it("blocks edits to umbral-docs/", () => {
      const result = dispatchHook(
        {
          hookEventName: "PreToolUse",
          toolName: "Edit",
          toolInput: { file_path: "/project/umbral-docs/edes/EDE-001.json" },
        },
        [EDE],
      );
      expect(result.action).toBe("deny");
      expect(result.reason).toContain("umbral-docs/");
      expect(result.reason).toContain("[S14]");
    });

    it("blocks edits to umbral-docs/ with backslash paths", () => {
      const result = dispatchHook(
        {
          hookEventName: "PreToolUse",
          toolName: "Write",
          toolInput: { file_path: "C:\\project\\umbral-docs\\README.md" },
        },
        [EDE],
      );
      expect(result.action).toBe("deny");
    });

    it("allows edits to other files with anti-pattern reminder", () => {
      const result = dispatchHook(
        {
          hookEventName: "PreToolUse",
          toolName: "Edit",
          toolInput: { file_path: "/project/packages/persistence/src/db.ts" },
        },
        [EDE],
      );
      expect(result.action).toBe("allow");
      expect(result.context).toContain("No usar PostgreSQL");
      expect(result.context).toContain("EDE-TEST-001");
    });

    it("allows edits without context when no anti-patterns", () => {
      const noAntiPatterns: Ede = {
        ...EDE,
        whatNotToDo: { antiPatterns: [] },
      };
      const result = dispatchHook(
        {
          hookEventName: "PreToolUse",
          toolName: "Edit",
          toolInput: { file_path: "/project/src/index.ts" },
        },
        [noAntiPatterns],
      );
      expect(result.action).toBe("allow");
      expect(result.context).toBeUndefined();
    });

    it("allows when no file_path in input", () => {
      const result = dispatchHook(
        { hookEventName: "PreToolUse", toolName: "Edit", toolInput: {} },
        [EDE],
      );
      expect(result.action).toBe("allow");
    });

    it("skips non-accepted EDEs for anti-pattern check", () => {
      const proposed: Ede = { ...EDE, status: "proposed" };
      const result = dispatchHook(
        {
          hookEventName: "PreToolUse",
          toolName: "Edit",
          toolInput: { file_path: "/project/src/index.ts" },
        },
        [proposed],
      );
      expect(result.action).toBe("allow");
      expect(result.context).toBeUndefined();
    });
  });

  describe("unknown hook types", () => {
    it("allows by default", () => {
      const result = dispatchHook(
        { hookEventName: "PostToolUse" },
        [EDE],
      );
      expect(result.action).toBe("allow");
    });
  });
});
