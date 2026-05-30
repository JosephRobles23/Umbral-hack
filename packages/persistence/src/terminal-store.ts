import type Database from "better-sqlite3";
import type { TerminalSession, TerminalSessionStatus } from "@umbral/contracts";

export function createTerminalStore(db: Database.Database) {
  return {
    save(session: TerminalSession): void {
      db.prepare(
        `INSERT OR REPLACE INTO terminal_sessions
         (id, ede_id, pid, status, working_directory, claude_md_path, created_at, last_activity_at, terminated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        session.id,
        session.edeId,
        session.pid,
        session.status,
        session.workingDirectory,
        session.claudeMdPath,
        session.createdAt,
        session.lastActivityAt,
        session.terminatedAt,
      );
    },

    getById(id: string): TerminalSession | null {
      const row = db
        .prepare("SELECT * FROM terminal_sessions WHERE id = ?")
        .get(id) as Record<string, unknown> | undefined;
      return row ? mapRow(row) : null;
    },

    getActive(): TerminalSession[] {
      const rows = db
        .prepare("SELECT * FROM terminal_sessions WHERE status = 'active' ORDER BY created_at DESC")
        .all() as Record<string, unknown>[];
      return rows.map(mapRow);
    },

    getRecent(limit: number = 10): TerminalSession[] {
      const rows = db
        .prepare("SELECT * FROM terminal_sessions ORDER BY created_at DESC LIMIT ?")
        .all(limit) as Record<string, unknown>[];
      return rows.map(mapRow);
    },

    updateStatus(id: string, status: TerminalSessionStatus): void {
      const now = new Date().toISOString();
      if (status === "terminated") {
        db.prepare(
          "UPDATE terminal_sessions SET status = ?, terminated_at = ?, last_activity_at = ? WHERE id = ?",
        ).run(status, now, now, id);
      } else {
        db.prepare(
          "UPDATE terminal_sessions SET status = ?, last_activity_at = ? WHERE id = ?",
        ).run(status, now, id);
      }
    },
  };
}

function mapRow(row: Record<string, unknown>): TerminalSession {
  return {
    id: row.id as string,
    edeId: (row.ede_id as string) ?? null,
    pid: row.pid as number,
    status: row.status as TerminalSessionStatus,
    workingDirectory: row.working_directory as string,
    claudeMdPath: (row.claude_md_path as string) ?? null,
    createdAt: row.created_at as string,
    lastActivityAt: row.last_activity_at as string,
    terminatedAt: (row.terminated_at as string) ?? null,
  };
}
