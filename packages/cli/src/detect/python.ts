import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Detection, Detector } from "./types.js";

function readTextFile(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

function extractPythonDeps(projectPath: string): string[] {
  const deps: string[] = [];

  const reqPath = join(projectPath, "requirements.txt");
  if (existsSync(reqPath)) {
    const content = readTextFile(reqPath);
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-")) {
        const name = trimmed.split(/[>=<!\[;]/)[0].trim().toLowerCase();
        if (name) deps.push(name);
      }
    }
  }

  const pyprojectPath = join(projectPath, "pyproject.toml");
  if (existsSync(pyprojectPath)) {
    const content = readTextFile(pyprojectPath);
    const depMatches = content.match(/["']([a-zA-Z0-9_-]+)(?:\[.*?\])?(?:[>=<~!].*?)?["']/g);
    if (depMatches) {
      for (const m of depMatches) {
        const name = m.replace(/["']/g, "").split(/[>=<~!\[]/)[0].trim().toLowerCase();
        if (name && name.length > 1) deps.push(name);
      }
    }
  }

  return [...new Set(deps)];
}

export class PythonDetector implements Detector {
  detect(projectPath: string): Detection[] {
    const hasPyproject = existsSync(join(projectPath, "pyproject.toml"));
    const hasRequirements = existsSync(join(projectPath, "requirements.txt"));
    const hasSetupPy = existsSync(join(projectPath, "setup.py"));
    const hasPipfile = existsSync(join(projectPath, "Pipfile"));
    const hasPoetryLock = existsSync(join(projectPath, "poetry.lock"));
    const hasManagePy = existsSync(join(projectPath, "manage.py"));

    if (!hasPyproject && !hasRequirements && !hasSetupPy && !hasPipfile && !hasManagePy) return [];

    const results: Detection[] = [];
    const evidence: string[] = [];

    if (hasPyproject) evidence.push("pyproject.toml");
    if (hasRequirements) evidence.push("requirements.txt");
    if (hasSetupPy) evidence.push("setup.py");
    if (hasPipfile) evidence.push("Pipfile");

    let pythonVersion = "";
    if (existsSync(join(projectPath, ".python-version"))) {
      pythonVersion = readTextFile(join(projectPath, ".python-version")).trim();
    }

    results.push({
      category: "runtime",
      name: `Python${pythonVersion ? ` ${pythonVersion}` : ""}`,
      slug: "python",
      confidence: 1,
      evidence,
      metadata: { pythonVersion },
    });

    if (hasPoetryLock) {
      results.push({ category: "package-manager", name: "Poetry", slug: "poetry", confidence: 1, evidence: ["poetry.lock"], metadata: {} });
    } else if (hasPipfile) {
      results.push({ category: "package-manager", name: "Pipenv", slug: "pipenv", confidence: 1, evidence: ["Pipfile"], metadata: {} });
    } else if (hasPyproject) {
      const content = readTextFile(join(projectPath, "pyproject.toml"));
      if (content.includes("uv")) {
        results.push({ category: "package-manager", name: "uv", slug: "uv", confidence: 0.7, evidence: ["pyproject.toml referencia uv"], metadata: {} });
      }
    }

    const deps = extractPythonDeps(projectPath);

    if (deps.includes("fastapi") || deps.includes("fastapi[standard]")) {
      results.push({ category: "framework", name: "FastAPI", slug: "fastapi", confidence: 1, evidence: ["fastapi en dependencies"], metadata: {} });
    } else if (hasManagePy || deps.includes("django")) {
      results.push({ category: "framework", name: "Django", slug: "django", confidence: 1, evidence: [hasManagePy ? "manage.py" : "django en dependencies"], metadata: {} });
    } else if (deps.includes("flask")) {
      results.push({ category: "framework", name: "Flask", slug: "flask", confidence: 1, evidence: ["flask en dependencies"], metadata: {} });
    } else if (deps.includes("streamlit")) {
      results.push({ category: "framework", name: "Streamlit", slug: "streamlit", confidence: 1, evidence: ["streamlit en dependencies"], metadata: {} });
    }

    if (deps.includes("sqlalchemy")) {
      results.push({ category: "database", name: "SQLAlchemy", slug: "sqlalchemy", confidence: 1, evidence: ["sqlalchemy en dependencies"], metadata: {} });
    } else if (deps.includes("supabase")) {
      results.push({ category: "database", name: "Supabase (PostgreSQL)", slug: "supabase", confidence: 1, evidence: ["supabase en dependencies"], metadata: {} });
    } else if (deps.includes("psycopg2") || deps.includes("psycopg2-binary") || deps.includes("asyncpg")) {
      results.push({ category: "database", name: "PostgreSQL", slug: "postgresql-python", confidence: 0.9, evidence: ["driver PostgreSQL en dependencies"], metadata: {} });
    }

    if (deps.includes("pytest")) {
      results.push({ category: "testing", name: "pytest", slug: "pytest", confidence: 1, evidence: ["pytest en dependencies"], metadata: {} });
    } else if (deps.includes("unittest")) {
      results.push({ category: "testing", name: "unittest", slug: "unittest", confidence: 0.8, evidence: ["unittest en dependencies"], metadata: {} });
    }

    if (deps.includes("langchain") || deps.includes("langchain-core") || deps.includes("langgraph")) {
      const parts: string[] = [];
      if (deps.includes("langchain") || deps.includes("langchain-core")) parts.push("LangChain");
      if (deps.includes("langgraph")) parts.push("LangGraph");
      results.push({ category: "framework", name: parts.join(" + "), slug: "langchain", confidence: 1, evidence: parts.map(p => `${p.toLowerCase()} en dependencies`), metadata: {} });
    }

    return results;
  }
}
