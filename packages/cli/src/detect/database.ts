import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

function readDeps(projectPath: string): Record<string, string> {
  try {
    const pkg = JSON.parse(readFileSync(join(projectPath, "package.json"), "utf-8"));
    return { ...(pkg.devDependencies ?? {}), ...(pkg.dependencies ?? {}) };
  } catch {
    return {};
  }
}

function detectPrismaProvider(projectPath: string): string | null {
  const schemaPath = join(projectPath, "prisma", "schema.prisma");
  if (!existsSync(schemaPath)) return null;
  try {
    const content = readFileSync(schemaPath, "utf-8");
    const match = content.match(/provider\s*=\s*"(\w+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export class DatabaseDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const deps = readDeps(projectPath);
    const results: Detection[] = [];

    if (deps["@prisma/client"] || deps["prisma"]) {
      const provider = detectPrismaProvider(projectPath);
      const dbName = provider === "postgresql" ? "PostgreSQL"
        : provider === "mysql" ? "MySQL"
        : provider === "sqlite" ? "SQLite"
        : provider === "mongodb" ? "MongoDB"
        : "SQL";
      const slug = `${(provider ?? "sql").toLowerCase()}-prisma`;

      results.push({
        category: "database",
        name: `${dbName} (Prisma)`,
        slug,
        confidence: provider ? 1 : 0.7,
        evidence: [
          "@prisma/client en dependencies",
          ...(provider ? [`provider: ${provider} en prisma/schema.prisma`] : []),
        ],
        metadata: { orm: "prisma", provider: provider ?? "unknown" },
      });
    } else if (deps["drizzle-orm"]) {
      const hasPostgres = !!deps["pg"] || !!deps["postgres"] || !!deps["@neondatabase/serverless"];
      const slug = hasPostgres ? "postgresql-drizzle" : "sql-drizzle";
      results.push({
        category: "database",
        name: `${hasPostgres ? "PostgreSQL" : "SQL"} (Drizzle)`,
        slug,
        confidence: 0.9,
        evidence: ["drizzle-orm en dependencies"],
        metadata: { orm: "drizzle" },
      });
    } else if (deps["mongoose"]) {
      results.push({
        category: "database", name: "MongoDB (Mongoose)", slug: "mongodb-mongoose",
        confidence: 1, evidence: ["mongoose en dependencies"], metadata: { orm: "mongoose" },
      });
    } else if (deps["better-sqlite3"]) {
      results.push({
        category: "database", name: "SQLite (better-sqlite3)", slug: "sqlite-bettersqlite3",
        confidence: 1, evidence: ["better-sqlite3 en dependencies"], metadata: { orm: "better-sqlite3" },
      });
    } else if (deps["pg"]) {
      results.push({
        category: "database", name: "PostgreSQL (pg)", slug: "postgresql-pg",
        confidence: 0.9, evidence: ["pg en dependencies"], metadata: { orm: "pg" },
      });
    }

    return results;
  }
}
