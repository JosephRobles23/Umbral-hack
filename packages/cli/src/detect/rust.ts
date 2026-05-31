import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class RustDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const cargoPath = join(projectPath, "Cargo.toml");
    if (!existsSync(cargoPath)) return [];

    const results: Detection[] = [];
    let edition = "";

    try {
      const content = readFileSync(cargoPath, "utf-8");
      const editionMatch = content.match(/edition\s*=\s*"(\d+)"/);
      if (editionMatch) edition = editionMatch[1];
    } catch {}

    results.push({
      category: "runtime",
      name: `Rust${edition ? ` (edition ${edition})` : ""}`,
      slug: "rust",
      confidence: 1,
      evidence: ["Cargo.toml"],
      metadata: { edition },
    });

    return results;
  }
}
