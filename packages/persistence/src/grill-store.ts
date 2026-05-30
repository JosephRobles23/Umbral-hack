import type Database from "better-sqlite3";
import type { GrillSession, CognitiveDebt } from "@umbral/contracts";

export function createGrillStore(db: Database.Database) {
  return {
    saveSession(session: GrillSession): void {
      db.prepare(
        `INSERT OR REPLACE INTO grill_sessions (id, ede_id, data, status, alignment_score, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        session.id,
        session.edeId,
        JSON.stringify(session),
        session.status,
        session.alignmentScore,
        session.createdAt,
        session.updatedAt,
      );
    },

    getSession(id: string): GrillSession | null {
      const row = db
        .prepare("SELECT data FROM grill_sessions WHERE id = ?")
        .get(id) as { data: string } | undefined;
      return row ? JSON.parse(row.data) : null;
    },

    getActiveSession(): GrillSession | null {
      const row = db
        .prepare(
          "SELECT data FROM grill_sessions WHERE status = 'in_progress' ORDER BY updated_at DESC LIMIT 1",
        )
        .get() as { data: string } | undefined;
      return row ? JSON.parse(row.data) : null;
    },

    saveDebt(debt: CognitiveDebt): void {
      db.prepare(
        `INSERT INTO cognitive_debts (id, session_id, ede_id, gap, reason, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).run(debt.id, debt.sessionId, debt.edeId, debt.gap, debt.reason, debt.createdAt);
    },

    getDebts(): CognitiveDebt[] {
      return db
        .prepare("SELECT * FROM cognitive_debts ORDER BY created_at DESC")
        .all() as CognitiveDebt[];
    },
  };
}
