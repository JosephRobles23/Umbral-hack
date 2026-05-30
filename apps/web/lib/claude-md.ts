import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Ede } from "@umbral/contracts";
import { assembleClaudeContext } from "@umbral/orchestrator";

export function generateClaudeMd(edes: Ede[], targetDir: string): string {
  const content = assembleClaudeContext(edes);
  const claudeDir = join(targetDir, ".claude");
  mkdirSync(claudeDir, { recursive: true });
  const filePath = join(claudeDir, "CLAUDE.md");
  writeFileSync(filePath, content, "utf-8");
  return filePath;
}
