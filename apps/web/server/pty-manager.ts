import * as pty from "node-pty";
import { execSync } from "node:child_process";
import type { TerminalConfig } from "@umbral/contracts";

const IS_WINDOWS = process.platform === "win32";
const DEFAULT_SHELL = IS_WINDOWS ? "powershell.exe" : process.env.SHELL || "/bin/bash";

function resolveShell(shell: string): string {
  if (!shell) return DEFAULT_SHELL;

  if (shell === "claude") {
    try {
      const resolved = IS_WINDOWS
        ? execSync("where claude", { encoding: "utf-8" }).split("\n")[0].trim()
        : execSync("which claude", { encoding: "utf-8" }).trim();
      if (resolved) return resolved;
    } catch {
      // claude not found in PATH, fall back
    }
    return DEFAULT_SHELL;
  }

  return shell;
}

export function spawnPty(config: TerminalConfig): pty.IPty {
  const shell = resolveShell(config.shell);
  return pty.spawn(shell, config.args, {
    name: "xterm-256color",
    cols: config.cols || 80,
    rows: config.rows || 24,
    cwd: config.cwd,
    env: { ...process.env, ...config.env } as Record<string, string>,
  });
}

export function resizePty(p: pty.IPty, cols: number, rows: number): void {
  p.resize(cols, rows);
}

export function killPty(p: pty.IPty): void {
  p.kill();
}
