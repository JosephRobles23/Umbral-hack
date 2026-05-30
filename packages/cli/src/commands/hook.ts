import { openDb } from "@umbral/persistence";
import { createEdeStore } from "@umbral/persistence";
import { dispatchHook } from "@umbral/orchestrator";
import type { ClaudeHookInput } from "@umbral/contracts";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function hookCommand(_event: string): Promise<void> {
  const raw = await readStdin();
  let input: ClaudeHookInput;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  let edes;
  try {
    const db = openDb();
    edes = createEdeStore(db).getAll();
    db.close();
  } catch {
    process.exit(0);
  }

  const result = dispatchHook(
    {
      hookEventName: input.hook_event_name,
      toolName: input.tool_name,
      toolInput: input.tool_input,
      cwd: input.cwd,
      source: input.source,
    },
    edes,
  );

  if (input.hook_event_name === "SessionStart" && result.action === "context") {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "SessionStart",
          additionalContext: result.context,
        },
      }),
    );
    return;
  }

  if (input.hook_event_name === "PreToolUse") {
    if (result.action === "deny") {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: result.reason,
          },
        }),
      );
      return;
    }

    if (result.context) {
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "allow",
          },
          additionalContext: result.context,
        }),
      );
    }
  }
}
