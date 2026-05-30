import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class NodeDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const pkgPath = join(projectPath, "package.json");
    if (!existsSync(pkgPath)) return [];

    const results: Detection[] = [];
    let pkg: Record<string, unknown>;
    try {
      pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    } catch {
      return [];
    }

    const engines = pkg.engines as Record<string, string> | undefined;
    const nodeVersion = engines?.node ?? "";

    results.push({
      category: "runtime",
      name: `Node.js${nodeVersion ? ` (${nodeVersion})` : ""}`,
      slug: "nodejs",
      confidence: 1,
      evidence: ["package.json existe"],
      metadata: { nodeVersion },
    });

    if (existsSync(join(projectPath, "pnpm-lock.yaml"))) {
      results.push({ category: "package-manager", name: "pnpm", slug: "pnpm", confidence: 1, evidence: ["pnpm-lock.yaml"], metadata: {} });
    } else if (existsSync(join(projectPath, "yarn.lock"))) {
      results.push({ category: "package-manager", name: "Yarn", slug: "yarn", confidence: 1, evidence: ["yarn.lock"], metadata: {} });
    } else if (existsSync(join(projectPath, "bun.lockb"))) {
      results.push({ category: "package-manager", name: "Bun", slug: "bun", confidence: 1, evidence: ["bun.lockb"], metadata: {} });
    } else if (existsSync(join(projectPath, "package-lock.json"))) {
      results.push({ category: "package-manager", name: "npm", slug: "npm", confidence: 1, evidence: ["package-lock.json"], metadata: {} });
    }

    return results;
  }
}
