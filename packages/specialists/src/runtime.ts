import type { SessionNode, SemanticSessionStore } from "@umbral/contracts";

export interface AgentTool {
  name: string;
  description: string;
  run: (query: string, filters?: Record<string, string>) => unknown;
}

export function createReadPastSessionsTool(
  store: SemanticSessionStore,
): AgentTool {
  return {
    name: "readPastSessions",
    description:
      "Search past sessions by text query. Returns matching SessionNodes from the semantic store (FTS5). Read-only.",
    run: (query: string, filters?: Record<string, string>): SessionNode[] => {
      return store.search(query, filters);
    },
  };
}
