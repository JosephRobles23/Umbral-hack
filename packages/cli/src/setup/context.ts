import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { openDb } from "@umbral/persistence";
import { createEdeStore } from "@umbral/persistence";
import { assembleClaudeContext } from "@umbral/orchestrator";

export function setupContext(projectPath: string): void {
  const db = openDb();
  const edes = createEdeStore(db).getAll();
  db.close();

  const content = assembleClaudeContext(edes);
  const claudeDir = join(projectPath, ".claude");
  mkdirSync(claudeDir, { recursive: true });
  writeFileSync(join(claudeDir, "CLAUDE.md"), content, "utf-8");
}
