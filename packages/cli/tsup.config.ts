import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist",
    clean: true,
    splitting: false,
    banner: { js: "#!/usr/bin/env node" },
    noExternal: ["@umbral/contracts", "@umbral/persistence", "@umbral/orchestrator"],
    external: ["better-sqlite3", "sqlite-vec", "commander", "zod"],
  },
  {
    entry: ["src/mcp-entry.ts"],
    format: ["esm"],
    target: "node18",
    outDir: "dist",
    clean: false,
    splitting: false,
    noExternal: [
      "@umbral/mcp-server",
      "@umbral/contracts",
      "@umbral/persistence",
      "@umbral/orchestrator",
      "@umbral/specialists",
    ],
    external: ["better-sqlite3", "sqlite-vec", "@modelcontextprotocol/sdk"],
  },
]);
