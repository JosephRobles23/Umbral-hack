import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

function readDeps(projectPath: string): { deps: Record<string, string>; devDeps: Record<string, string> } {
  try {
    const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"));
    return {
      deps: (pkg.dependencies ?? {}) as Record<string, string>,
      devDeps: (pkg.devDependencies ?? {}) as Record<string, string>,
    };
  } catch {
    return { deps: {}, devDeps: {} };
  }
}

export class FrameworkDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const { deps, devDeps } = readDeps(projectPath);
    const all = { ...devDeps, ...deps };
    const results: Detection[] = [];

    if (all["next"]) {
      const version = deps["next"] ?? devDeps["next"] ?? "";
      const hasAppDir = existsSync(join(projectPath, "app")) || existsSync(join(projectPath, "src", "app"));
      const hasPagesDir = existsSync(join(projectPath, "pages")) || existsSync(join(projectPath, "src", "pages"));
      const router = hasAppDir ? "App Router" : hasPagesDir ? "Pages Router" : "App Router";
      const slug = hasAppDir || !hasPagesDir ? "nextjs-app-router" : "nextjs-pages";

      results.push({
        category: "framework",
        name: `Next.js ${version.replace("^", "")} (${router})`,
        slug,
        confidence: 1,
        evidence: [`next@${version} en dependencies`, `${router} detectado`],
        metadata: { version: version.replace("^", ""), router: router.toLowerCase() },
      });
    } else if (all["nuxt"]) {
      results.push({ category: "framework", name: "Nuxt", slug: "nuxt", confidence: 1, evidence: ["nuxt en dependencies"], metadata: {} });
    } else if (all["@remix-run/node"] || all["@remix-run/react"]) {
      results.push({ category: "framework", name: "Remix", slug: "remix", confidence: 1, evidence: ["@remix-run en dependencies"], metadata: {} });
    } else if (all["express"]) {
      results.push({ category: "framework", name: "Express.js", slug: "express", confidence: 1, evidence: ["express en dependencies"], metadata: {} });
    } else if (all["hono"]) {
      results.push({ category: "framework", name: "Hono", slug: "hono", confidence: 1, evidence: ["hono en dependencies"], metadata: {} });
    } else if (all["fastify"]) {
      results.push({ category: "framework", name: "Fastify", slug: "fastify", confidence: 1, evidence: ["fastify en dependencies"], metadata: {} });
    }

    return results;
  }
}
