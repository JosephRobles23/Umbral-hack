export interface ClaudeHookInput {
  session_id: string;
  cwd: string;
  hook_event_name: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_result?: unknown;
  source?: string;
}

export interface PreToolUseOutput {
  hookSpecificOutput: {
    hookEventName: "PreToolUse";
    permissionDecision: "allow" | "deny" | "ask";
    permissionDecisionReason?: string;
  };
  additionalContext?: string;
}

export interface SessionStartOutput {
  hookSpecificOutput: {
    hookEventName: "SessionStart";
    additionalContext: string;
  };
}

export type HookOutput = PreToolUseOutput | SessionStartOutput;

export interface HookDispatchInput {
  hookEventName: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  cwd?: string;
  source?: string;
}

export interface HookDispatchResult {
  action: "allow" | "deny" | "context";
  reason?: string;
  context?: string;
}
