import { openDb } from "../packages/persistence/src/db";
import { createEdeStore } from "../packages/persistence/src/ede-store";
import { dispatchHook } from "../packages/orchestrator/src/hook-dispatch";
import type { ClaudeHookInput } from "../packages/contracts/src/hook-event";

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function main() {
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
    const output = {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: result.context,
      },
    };
    process.stdout.write(JSON.stringify(output));
    return;
  }

  if (input.hook_event_name === "PreToolUse") {
    if (result.action === "deny") {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: result.reason,
        },
      };
      process.stdout.write(JSON.stringify(output));
      return;
    }

    if (result.context) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "allow",
        },
        additionalContext: result.context,
      };
      process.stdout.write(JSON.stringify(output));
      return;
    }
  }
}

main().catch(() => process.exit(0));
