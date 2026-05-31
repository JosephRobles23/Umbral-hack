import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

export class DockerDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const results: Detection[] = [];

    if (existsSync(join(projectPath, "Dockerfile"))) {
      results.push({
        category: "infra",
        name: "Docker",
        slug: "docker",
        confidence: 1,
        evidence: ["Dockerfile"],
        metadata: {},
      });
    }

    const composeNames = ["docker-compose.yml", "docker-compose.yaml", "compose.yml", "compose.yaml"];
    const found = composeNames.find((n) => existsSync(join(projectPath, n)));
    if (found) {
      results.push({
        category: "infra",
        name: "Docker Compose",
        slug: "docker-compose",
        confidence: 1,
        evidence: [found],
        metadata: {},
      });
    }

    return results;
  }
}
