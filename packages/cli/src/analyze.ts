import type { AnalysisResult, Detector } from "./detect/types.js";
import { NodeDetector } from "./detect/node.js";
import { FrameworkDetector } from "./detect/framework.js";
import { DatabaseDetector } from "./detect/database.js";
import { TestingDetector } from "./detect/testing.js";
import { BuildDetector } from "./detect/build.js";
import { StylingDetector } from "./detect/styling.js";

const DETECTORS: Detector[] = [
  new NodeDetector(),
  new FrameworkDetector(),
  new DatabaseDetector(),
  new TestingDetector(),
  new BuildDetector(),
  new StylingDetector(),
];

export function analyzeProject(projectPath: string): AnalysisResult {
  const detections = DETECTORS.flatMap((d) => d.detect(projectPath));
  detections.sort((a, b) => b.confidence - a.confidence);
  return { projectPath, detections };
}
