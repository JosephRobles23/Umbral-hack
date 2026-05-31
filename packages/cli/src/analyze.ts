import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { AnalysisResult, Detection, Detector } from "./detect/types.js";
import { NodeDetector } from "./detect/node.js";
import { FrameworkDetector } from "./detect/framework.js";
import { DatabaseDetector } from "./detect/database.js";
import { TestingDetector } from "./detect/testing.js";
import { BuildDetector } from "./detect/build.js";
import { StylingDetector } from "./detect/styling.js";
import { PythonDetector } from "./detect/python.js";
import { GoDetector } from "./detect/go.js";
import { RustDetector } from "./detect/rust.js";
import { DockerDetector } from "./detect/docker.js";

const DETECTORS: Detector[] = [
  new NodeDetector(),
  new PythonDetector(),
  new GoDetector(),
  new RustDetector(),
  new FrameworkDetector(),
  new DatabaseDetector(),
  new TestingDetector(),
  new BuildDetector(),
  new StylingDetector(),
  new DockerDetector(),
];

const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", "__pycache__",
  ".venv", "venv", "env", ".env", ".tox", "coverage", ".turbo",
  ".cache", "target", "vendor",
]);

function runDetectors(dirPath: string): Detection[] {
  return DETECTORS.flatMap((d) => d.detect(dirPath));
}

export function analyzeProject(projectPath: string): AnalysisResult {
  const detections: Detection[] = runDetectors(projectPath);

  try {
    const entries = readdirSync(projectPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;

      const subPath = join(projectPath, entry.name);
      const subDetections = runDetectors(subPath);

      for (const d of subDetections) {
        d.subdir = entry.name;
        d.name = `${d.name} (${entry.name}/)`;
        detections.push(d);
      }
    }
  } catch {}

  detections.sort((a, b) => b.confidence - a.confidence);
  return { projectPath, detections };
}
