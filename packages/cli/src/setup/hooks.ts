import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function setupHooks(projectPath: string): void {
  const claudeDir = join(projectPath, ".claude");
  mkdirSync(claudeDir, { recursive: true });

  const settingsPath = join(claudeDir, "settings.json");

  let existing: Record<string, unknown> = {};
  if (existsSync(settingsPath)) {
    try {
      existing = JSON.parse(readFileSync(settingsPath, "utf-8"));
    } catch {
      // start fresh
    }
  }

  const settings = {
    ...existing,
    hooks: {
      SessionStart: [
        {
          matcher: "",
          hooks: [
            {
              type: "command",
              command: "npx @umbral/cli hook session-start",
              timeout: 10,
              statusMessage: "Cargando contexto de gobernanza Umbral...",
            },
          ],
        },
      ],
      PreToolUse: [
        {
          matcher: "Edit|Write",
          hooks: [
            {
              type: "command",
              command: "npx @umbral/cli hook pre-tool-use",
              timeout: 10,
              statusMessage: "Verificando gates Umbral...",
            },
          ],
        },
      ],
    },
    mcpServers: {
      ...(typeof existing.mcpServers === "object" && existing.mcpServers !== null
        ? existing.mcpServers
        : {}),
      umbral: {
        command: "npx",
        args: ["@umbral/cli", "mcp"],
      },
    },
  };

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n", "utf-8");
}
