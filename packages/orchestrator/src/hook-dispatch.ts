import type { Ede, HookDispatchInput, HookDispatchResult } from "@umbral/contracts";
import { assembleClaudeContext } from "./claude-context";

const READ_ONLY_DIRS = ["umbral-docs/", "umbral-docs\\"];

function isReadOnlyPath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  return READ_ONLY_DIRS.some((dir) => normalized.includes(dir));
}

function dispatchSessionStart(edes: Ede[]): HookDispatchResult {
  const context = assembleClaudeContext(edes);
  return { action: "context", context };
}

function dispatchPreToolUse(
  input: HookDispatchInput,
  edes: Ede[],
): HookDispatchResult {
  const toolName = input.toolName ?? "";
  if (toolName !== "Edit" && toolName !== "Write") {
    return { action: "allow" };
  }

  const filePath = (input.toolInput?.file_path as string) ?? "";
  if (!filePath) return { action: "allow" };

  if (isReadOnlyPath(filePath)) {
    return {
      action: "deny",
      reason: `[S14] umbral-docs/ es read-only. Las decisiones se gestionan via EDEs en la DB.`,
    };
  }

  const accepted = edes.filter((e) => e.status === "accepted");
  const antiPatterns = accepted.flatMap((e) =>
    e.whatNotToDo.antiPatterns.map((ap) => ({ edeId: e.id, pattern: ap })),
  );

  if (antiPatterns.length > 0) {
    return {
      action: "allow",
      context: formatAntiPatternReminder(antiPatterns),
    };
  }

  return { action: "allow" };
}

function formatAntiPatternReminder(
  patterns: Array<{ edeId: string; pattern: string }>,
): string {
  const lines = patterns.map((p) => `- [${p.edeId}] ${p.pattern}`);
  return `Anti-patterns activos (no violar):\n${lines.join("\n")}`;
}

export function dispatchHook(
  input: HookDispatchInput,
  edes: Ede[],
): HookDispatchResult {
  switch (input.hookEventName) {
    case "SessionStart":
      return dispatchSessionStart(edes);
    case "PreToolUse":
      return dispatchPreToolUse(input, edes);
    default:
      return { action: "allow" };
  }
}
