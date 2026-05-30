import type Database from "better-sqlite3";
import type { SessionNode, SemanticSessionStore } from "@umbral/contracts";

export function createSemanticStore(db: Database.Database): SemanticSessionStore {
  return {
    index(node: SessionNode): void {
      db.prepare(
        `INSERT OR REPLACE INTO session_nodes (id, session_id, type, content, metadata, source_doc_node, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        node.id,
        node.sessionId,
        node.type,
        node.content,
        JSON.stringify(node.metadata),
        node.sourceDocNode,
        node.createdAt,
      );

      db.prepare(
        `INSERT OR REPLACE INTO session_nodes_fts (node_id, content, session_id, type)
         VALUES (?, ?, ?, ?)`,
      ).run(node.id, node.content, node.sessionId, node.type);
    },

    search(
      query: string,
      filters?: { type?: string; sessionId?: string },
    ): SessionNode[] {
      let ftsQuery = `SELECT node_id FROM session_nodes_fts WHERE content MATCH ?`;
      const params: unknown[] = [query];

      if (filters?.type) {
        ftsQuery += ` AND type = ?`;
        params.push(filters.type);
      }
      if (filters?.sessionId) {
        ftsQuery += ` AND session_id = ?`;
        params.push(filters.sessionId);
      }

      const ids = db
        .prepare(ftsQuery)
        .pluck()
        .all(...params) as string[];

      if (ids.length === 0) return [];

      const placeholders = ids.map(() => "?").join(",");
      const rows = db
        .prepare(
          `SELECT * FROM session_nodes WHERE id IN (${placeholders})`,
        )
        .all(...ids) as Array<{
        id: string;
        session_id: string;
        type: string;
        content: string;
        metadata: string;
        source_doc_node: string;
        created_at: string;
      }>;

      return rows.map((r) => ({
        id: r.id,
        sessionId: r.session_id,
        type: r.type,
        content: r.content,
        metadata: JSON.parse(r.metadata || "{}"),
        sourceDocNode: r.source_doc_node,
        createdAt: r.created_at,
      }));
    },
  };
}
