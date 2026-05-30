import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export async function mcpCommand(): Promise<void> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const mcpEntry = join(__dirname, "mcp-entry.js");

  execFileSync(process.execPath, [mcpEntry], {
    stdio: "inherit",
  });
}
