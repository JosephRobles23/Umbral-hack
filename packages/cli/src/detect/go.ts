import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class GoDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const goModPath = join(projectPath, "go.mod");
    if (!existsSync(goModPath)) return [];

    const results: Detection[] = [];
    let moduleName = "";
    let goVersion = "";

    try {
      const content = readFileSync(goModPath, "utf-8");
      const moduleMatch = content.match(/^module\s+(\S+)/m);
      const versionMatch = content.match(/^go\s+(\S+)/m);
      if (moduleMatch) moduleName = moduleMatch[1];
      if (versionMatch) goVersion = versionMatch[1];
    } catch {}

    results.push({
      category: "runtime",
      name: `Go${goVersion ? ` ${goVersion}` : ""}`,
      slug: "golang",
      confidence: 1,
      evidence: ["go.mod"],
      metadata: { moduleName, goVersion },
    });

    return results;
  }
}
