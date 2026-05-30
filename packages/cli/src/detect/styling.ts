import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class StylingDetector implements Detector {
  detect(projectPath: string): Detection[] {
    let deps: Record<string, string> = {};
    try {
      const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"));
      deps = { ...(pkg.devDependencies ?? {}), ...(pkg.dependencies ?? {}) };
    } catch {
      return [];
    }

    if (deps["tailwindcss"]) {
      const hasConfig = existsSync(join(projectPath, "tailwind.config.ts"))
        || existsSync(join(projectPath, "tailwind.config.js"));
      return [{
        category: "styling", name: "Tailwind CSS", slug: "tailwindcss",
        confidence: hasConfig ? 1 : 0.8,
        evidence: ["tailwindcss en devDependencies", ...(hasConfig ? ["tailwind.config.* existe"] : [])],
        metadata: {},
      }];
    }
    if (deps["styled-components"]) {
      return [{ category: "styling", name: "Styled Components", slug: "styled-components", confidence: 1, evidence: ["styled-components en dependencies"], metadata: {} }];
    }
    if (deps["sass"] || deps["node-sass"]) {
      return [{ category: "styling", name: "Sass", slug: "sass", confidence: 1, evidence: ["sass en devDependencies"], metadata: {} }];
    }
    return [];
  }
}
