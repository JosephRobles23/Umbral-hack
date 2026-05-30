import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class TestingDetector implements Detector {
  detect(projectPath: string): Detection[] {
    let deps: Record<string, string> = {};
    try {
      const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"));
      deps = { ...(pkg.devDependencies ?? {}), ...(pkg.dependencies ?? {}) };
    } catch {
      return [];
    }

    if (deps["vitest"]) {
      return [{ category: "testing", name: "Vitest", slug: "vitest", confidence: 1, evidence: ["vitest en devDependencies"], metadata: {} }];
    }
    if (deps["jest"]) {
      return [{ category: "testing", name: "Jest", slug: "jest", confidence: 1, evidence: ["jest en devDependencies"], metadata: {} }];
    }
    if (deps["@playwright/test"]) {
      return [{ category: "testing", name: "Playwright", slug: "playwright", confidence: 1, evidence: ["@playwright/test en devDependencies"], metadata: {} }];
    }
    if (deps["cypress"]) {
      return [{ category: "testing", name: "Cypress", slug: "cypress", confidence: 1, evidence: ["cypress en devDependencies"], metadata: {} }];
    }
    return [];
  }
}
