import type Database from "better-sqlite3";
import type { Ede } from "@umbral/contracts";
import { createEdeStore, createGrillStore, createSemanticStore } from "@umbral/persistence";
import { assembleClaudeContext, codeGuard, planGuard } from "@umbral/orchestrator";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "umbral_ede_list",
    description:
      "List all EDEs (Explicit Decision Structures) in the project. Returns id, title, status, and cognitive level for each.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["accepted", "proposed", "deprecated"],
          description: "Filter by status. Omit to list all.",
        },
      },
    },
  },
  {
    name: "umbral_ede_get",
    description:
      "Get full details of a specific EDE by ID. Includes decision, mechanism, rationale, anti-patterns, contracts, and tests.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "EDE ID (e.g. EDE-000-persistence)" },
      },
      required: ["id"],
    },
  },
  {
    name: "umbral_ede_search",
    description:
      "Search EDEs by text query. Matches against title, decision, mechanism, rationale, and anti-patterns.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query text" },
      },
      required: ["query"],
    },
  },
  {
    name: "umbral_context",
    description:
      "Get the full assembled Umbral governance context. Contains all active decisions, anti-patterns, layer contracts, and rules.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "umbral_grill_status",
    description:
      "Get the current Grill Me alignment session status. Shows active session, alignment score, and cognitive debts.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "umbral_semantic_search",
    description:
      "Search indexed session content using FTS5 full-text search.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "FTS5 search query" },
        type: { type: "string", description: "Filter by node type" },
      },
      required: ["query"],
    },
  },
  {
    name: "umbral_gate_check",
    description:
      "Run a gate validation check. Validates EDE status and test plan against CodeGuard and PlanGuard.",
    inputSchema: {
      type: "object",
      properties: {
        edeId: { type: "string", description: "EDE ID to validate" },
        edeStatus: { type: "string", description: "EDE status (accepted/proposed/deprecated)" },
        unitTests: {
          type: "array",
          items: { type: "string" },
          description: "List of unit test identifiers",
        },
        sadPaths: {
          type: "array",
          items: { type: "string" },
          description: "List of sad path test identifiers",
        },
      },
      required: ["edeId"],
    },
  },
];

function searchEdes(edes: Ede[], query: string): Ede[] {
  const q = query.toLowerCase();
  return edes.filter((e) => {
    const searchable = [
      e.id,
      e.title,
      e.whatAndHow.decision,
      e.whatAndHow.mechanism,
      e.why.rationale,
      ...e.whatNotToDo.antiPatterns,
    ]
      .join(" ")
      .toLowerCase();
    return searchable.includes(q);
  });
}

export function handleToolCall(
  toolName: string,
  args: Record<string, unknown>,
  db: Database.Database,
): unknown {
  const edeStore = createEdeStore(db);

  switch (toolName) {
    case "umbral_ede_list": {
      const all = edeStore.getAll();
      const filtered = args.status
        ? all.filter((e) => e.status === args.status)
        : all;
      return filtered.map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status,
        cognitiveLevel: e.cognitiveLevel,
        complexityTier: e.complexityTier,
        decision: e.whatAndHow.decision,
      }));
    }

    case "umbral_ede_get": {
      const ede = edeStore.getById(args.id as string);
      if (!ede) return { error: `EDE ${args.id} not found` };
      return ede;
    }

    case "umbral_ede_search": {
      const all = edeStore.getAll();
      const results = searchEdes(all, args.query as string);
      return results.map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status,
        decision: e.whatAndHow.decision,
        mechanism: e.whatAndHow.mechanism,
      }));
    }

    case "umbral_context": {
      const all = edeStore.getAll();
      return { context: assembleClaudeContext(all) };
    }

    case "umbral_grill_status": {
      const grillStore = createGrillStore(db);
      const active = grillStore.getActiveSession();
      const debts = grillStore.getDebts();
      return {
        activeSession: active
          ? {
              id: active.id,
              edeId: active.edeId,
              status: active.status,
              alignmentScore: active.alignmentScore,
              roundCount: active.rounds.length,
            }
          : null,
        cognitiveDebts: debts.length,
        debts: debts.slice(0, 5),
      };
    }

    case "umbral_semantic_search": {
      const semanticStore = createSemanticStore(db);
      const results = semanticStore.search(
        args.query as string,
        args.type ? { type: args.type as string } : undefined,
      );
      return results.map((r) => ({
        id: r.id,
        type: r.type,
        content: r.content.slice(0, 500),
        sourceDocNode: r.sourceDocNode,
      }));
    }

    case "umbral_gate_check": {
      const ctx = {
        edeId: args.edeId as string,
        edeStatus: (args.edeStatus as string) ?? "accepted",
        plan: {
          unitTests: (args.unitTests as string[]) ?? [],
          sadPaths: (args.sadPaths as string[]) ?? [],
          coverageTarget: 0.8,
        },
      };

      const codeResult = codeGuard.evaluate(ctx);
      if (!codeResult.pass) {
        return { pass: false, gate: "CodeGuard", reason: codeResult.reason };
      }

      const planResult = planGuard.evaluate(ctx);
      if (!planResult.pass) {
        return { pass: false, gate: "PlanGuard", reason: planResult.reason };
      }

      return { pass: true, gates: ["CodeGuard", "PlanGuard"] };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}
