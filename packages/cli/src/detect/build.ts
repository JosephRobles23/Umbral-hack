import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class BuildDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const results: Detection[] = [];

    if (existsSync(join(projectPath, "turbo.json"))) {
      results.push({ category: "build", name: "Turborepo", slug: "turborepo", confidence: 1, evidence: ["turbo.json existe"], metadata: {} });
    } else if (existsSync(join(projectPath, "nx.json"))) {
      results.push({ category: "build", name: "Nx", slug: "nx", confidence: 1, evidence: ["nx.json existe"], metadata: {} });
    }

    let deps: Record<string, string> = {};
    try {
      const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"));
      deps = { ...(pkg.devDependencies ?? {}), ...(pkg.dependencies ?? {}) };
    } catch {
      return results;
    }

    if (!results.length && deps["vite"]) {
      results.push({ category: "build", name: "Vite", slug: "vite", confidence: 0.8, evidence: ["vite en devDependencies"], metadata: {} });
    }

    return results;
  }
}
