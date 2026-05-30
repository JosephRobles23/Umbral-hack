import type Database from "better-sqlite3";
import type { DocChunk, DocEmbeddingIndex } from "@umbral/contracts";

export function createEmbeddingIndex(db: Database.Database): DocEmbeddingIndex {
  return {
    upsert(chunk: DocChunk): void {
      const existing = db
        .prepare("SELECT rowid FROM doc_chunks WHERE id = ?")
        .get(chunk.id) as { rowid: number } | undefined;

      if (existing) {
        db.prepare(
          `UPDATE doc_chunks SET doc_id = ?, content = ?, source_doc_node = ?, created_at = ? WHERE id = ?`,
        ).run(chunk.docId, chunk.content, chunk.sourceDocNode, chunk.createdAt, chunk.id);

        db.prepare(
          `UPDATE doc_chunks_vec SET embedding = ? WHERE rowid = ?`,
        ).run(new Float32Array(chunk.embedding), existing.rowid);
      } else {
        const result = db
          .prepare(
            `INSERT INTO doc_chunks (id, doc_id, content, source_doc_node, created_at)
             VALUES (?, ?, ?, ?, ?)`,
          )
          .run(chunk.id, chunk.docId, chunk.content, chunk.sourceDocNode, chunk.createdAt);

        db.prepare(
          `INSERT INTO doc_chunks_vec (rowid, embedding) VALUES (cast(? as integer), ?)`,
        ).run(Number(result.lastInsertRowid), new Float32Array(chunk.embedding));
      }
    },

    query(
      embedding: number[],
      topK: number,
    ): { chunk: DocChunk; distance: number }[] {
      const rows = db
        .prepare(
          `SELECT v.rowid, v.distance, c.id, c.doc_id, c.content, c.source_doc_node, c.created_at
           FROM doc_chunks_vec v
           JOIN doc_chunks c ON c.rowid = v.rowid
           WHERE v.embedding MATCH ? AND v.k = ?
           ORDER BY v.distance`,
        )
        .all(new Float32Array(embedding), topK) as Array<{
        rowid: number;
        distance: number;
        id: string;
        doc_id: string;
        content: string;
        source_doc_node: string;
        created_at: string;
      }>;

      return rows.map((r) => ({
        chunk: {
          id: r.id,
          docId: r.doc_id,
          content: r.content,
          embedding: [],
          sourceDocNode: r.source_doc_node,
          createdAt: r.created_at,
        },
        distance: r.distance,
      }));
    },

    purge(docId: string): void {
      const rows = db
        .prepare("SELECT rowid FROM doc_chunks WHERE doc_id = ?")
        .all(docId) as { rowid: number }[];

      if (rows.length > 0) {
        const rowids = rows.map((r) => r.rowid);
        const placeholders = rowids.map(() => "?").join(",");
        db.prepare(
          `DELETE FROM doc_chunks_vec WHERE rowid IN (${placeholders})`,
        ).run(...rowids);
        db.prepare("DELETE FROM doc_chunks WHERE doc_id = ?").run(docId);
      }
    },
  };
}
