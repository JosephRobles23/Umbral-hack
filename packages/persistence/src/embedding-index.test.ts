import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import { runMigrations } from "./migrate";
import { createEmbeddingIndex } from "./embedding-index";
import type { DocChunk } from "@umbral/contracts";

function makeChunk(id: string, embedding: number[]): DocChunk {
  return {
    id,
    docId: "doc-1",
    content: `Content for ${id}`,
    embedding,
    sourceDocNode: "docnode-1",
    createdAt: "2026-01-01T00:00:00Z",
  };
}

function randomVec(dim: number): number[] {
  const v: number[] = [];
  for (let i = 0; i < dim; i++) v.push(i * 0.01);
  return v;
}

let db: Database.Database;

beforeEach(() => {
  db = new Database(":memory:");
  sqliteVec.load(db);
  runMigrations(db);
});

afterEach(() => db.close());

describe("EmbeddingIndex (S8 — sqlite-vec)", () => {
  it("upsert y query top-k por similitud", () => {
    const index = createEmbeddingIndex(db);
    const vec1 = randomVec(384);
    const vec2 = vec1.map((v) => v + 1);

    index.upsert(makeChunk("chunk-a", vec1));
    index.upsert(makeChunk("chunk-b", vec2));

    const results = index.query(vec1, 2);
    expect(results).toHaveLength(2);
    expect(results[0].chunk.id).toBe("chunk-a");
    expect(results[0].distance).toBeLessThan(results[1].distance);
  });

  it("purga chunks de un docId", () => {
    const index = createEmbeddingIndex(db);
    index.upsert(makeChunk("chunk-1", randomVec(384)));
    index.upsert({ ...makeChunk("chunk-2", randomVec(384)), docId: "doc-2" });

    index.purge("doc-1");

    const results = index.query(randomVec(384), 10);
    expect(results).toHaveLength(1);
    expect(results[0].chunk.docId).toBe("doc-2");
  });

  it("coexiste con FTS5 en el mismo archivo db", () => {
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type IN ('table','virtual table') ORDER BY name",
      )
      .pluck()
      .all() as string[];

    expect(tables).toContain("session_nodes_fts");
    expect(tables).toContain("doc_chunks_vec");
  });
});
