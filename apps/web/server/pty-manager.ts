import * as pty from "node-pty";
import type { TerminalConfig } from "@umbral/contracts";

const IS_WINDOWS = process.platform === "win32";
const DEFAULT_SHELL = IS_WINDOWS ? "powershell.exe" : process.env.SHELL || "/bin/bash";

export function spawnPty(config: TerminalConfig): pty.IPty {
  const shell = config.shell || DEFAULT_SHELL;
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
