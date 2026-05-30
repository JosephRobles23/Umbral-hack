import { z } from "zod";
import type Database from "better-sqlite3";
import type { Ede } from "@umbral/contracts";

const edeSchema = z.object({
  id: z.string(),
  title: z.string(),
  version: z.number(),
  status: z.enum(["proposed", "accepted", "deprecated"]),
  cognitiveLevel: z.enum(["explorer", "navigator", "anchor"]),
  complexityTier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  whatAndHow: z.object({ decision: z.string(), mechanism: z.string() }),
  why: z.object({
    rationale: z.string(),
    alternativesConsidered: z.array(
      z.object({ option: z.string(), rejectedBecause: z.string() }),
    ),
    references: z.array(z.string()),
  }),
  whatNotToDo: z.object({ antiPatterns: z.array(z.string()) }),
  whatsNext: z.object({
    continuations: z.array(z.string()),
    openQuestions: z.array(z.string()),
  }),
  contracts: z.object({
    layerContracts: z.array(z.string()),
    verifiedBy: z.array(z.string()),
  }),
  tests: z.object({
    unitTests: z.array(z.string()),
    sadPaths: z.array(z.string()),
    coverageTarget: z.number(),
  }),
  provenance: z.object({
    phase: z.string(),
    slice: z.number().nullable(),
    createdBy: z.string(),
    createdAt: z.string().nullable(),
    lastUpdated: z.string().nullable(),
  }),
});

export function loadEde(json: unknown): Ede {
  const result = edeSchema.safeParse(json);
  if (!result.success)
    throw new Error(`[S13] EDE inválida: ${result.error.message}`);
  if (!result.data.why.rationale.trim())
    throw new Error("[S13] EDE sin rationale no es una EDE.");
  return result.data;
}

export function createEdeStore(db: Database.Database) {
  return {
    save(ede: Ede): void {
      db.prepare(
        `INSERT OR REPLACE INTO edes (id, data, title, status, cognitive_level, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        ede.id,
        JSON.stringify(ede),
        ede.title,
        ede.status,
        ede.cognitiveLevel,
        ede.provenance.createdAt,
        ede.provenance.lastUpdated,
      );
    },

    getById(id: string): Ede | null {
      const row = db.prepare("SELECT data FROM edes WHERE id = ?").get(id) as
        | { data: string }
        | undefined;
      return row ? JSON.parse(row.data) : null;
    },

    getAll(): Ede[] {
      const rows = db.prepare("SELECT data FROM edes ORDER BY id").all() as {
        data: string;
      }[];
      return rows.map((r) => JSON.parse(r.data));
    },
  };
}
