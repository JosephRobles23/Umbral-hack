import type Database from "better-sqlite3";

interface Migration {
  id: string;
  up: string;
}

const migrations: Migration[] = [
  {
    id: "001_edes",
    up: `CREATE TABLE IF NOT EXISTS edes (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      cognitive_level TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    )`,
  },
  {
    id: "002_grill_sessions",
    up: `CREATE TABLE IF NOT EXISTS grill_sessions (
      id TEXT PRIMARY KEY,
      ede_id TEXT NOT NULL,
      data TEXT NOT NULL,
      status TEXT NOT NULL,
      alignment_score REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cognitive_debts (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      ede_id TEXT NOT NULL,
      gap REAL NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  },
  {
    id: "003_semantic_embeddings",
    up: `CREATE TABLE IF NOT EXISTS session_nodes (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT,
      source_doc_node TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS session_nodes_fts USING fts5(
      node_id UNINDEXED, content, session_id UNINDEXED, type UNINDEXED
    );
    CREATE TABLE IF NOT EXISTS doc_chunks (
      rowid INTEGER PRIMARY KEY AUTOINCREMENT,
      id TEXT UNIQUE NOT NULL,
      doc_id TEXT NOT NULL,
      content TEXT NOT NULL,
      source_doc_node TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS doc_chunks_vec USING vec0(
      embedding float[384]
    )`,
  },
  {
    id: "004_terminal_sessions",
    up: `CREATE TABLE IF NOT EXISTS terminal_sessions (
      id TEXT PRIMARY KEY,
      ede_id TEXT,
      pid INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      working_directory TEXT NOT NULL,
      claude_md_path TEXT,
      created_at TEXT NOT NULL,
      last_activity_at TEXT NOT NULL,
      terminated_at TEXT
    )`,
  },
];

export function runMigrations(db: Database.Database): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )`,
  );

  const applied = new Set(
    (db.prepare("SELECT id FROM _migrations").pluck().all() as string[]),
  );

  for (const m of migrations) {
    if (!applied.has(m.id)) {
      db.exec(m.up);
      db.prepare("INSERT INTO _migrations (id, applied_at) VALUES (?, ?)").run(
        m.id,
        new Date().toISOString(),
      );
    }
  }
}
