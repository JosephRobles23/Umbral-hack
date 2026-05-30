export type DetectionCategory =
  | "runtime"
  | "package-manager"
  | "framework"
  | "database"
  | "testing"
  | "build"
  | "styling";

export interface Detection {
  category: DetectionCategory;
  name: string;
  slug: string;
  confidence: number;
  evidence: string[];
  metadata: Record<string, unknown>;
}

export interface Detector {
  detect(projectPath: string): Detection[];
}

export interface AnalysisResult {
  projectPath: string;
  detections: Detection[];
}
