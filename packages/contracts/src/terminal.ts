export type TerminalSessionStatus = "active" | "detached" | "terminated";

export interface TerminalSession {
  id: string;
  edeId: string | null;
  pid: number;
  status: TerminalSessionStatus;
  workingDirectory: string;
  claudeMdPath: string | null;
  createdAt: string;
  lastActivityAt: string;
  terminatedAt: string | null;
}

export interface TerminalConfig {
  shell: string;
  args: string[];
  cols: number;
  rows: number;
  env: Record<string, string>;
  cwd: string;
}

export interface TerminalResize {
  cols: number;
  rows: number;
}
