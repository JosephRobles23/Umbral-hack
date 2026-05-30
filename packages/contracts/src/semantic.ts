export interface SessionNode {
  id: string;
  sessionId: string;
  type: string;
  content: string;
  metadata: Record<string, unknown>;
  sourceDocNode: string;
  createdAt: string;
}

export interface SemanticSessionStore {
  index(node: SessionNode): void;
  search(query: string, filters?: { type?: string; sessionId?: string }): SessionNode[];
}
