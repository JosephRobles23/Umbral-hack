import type { Ede } from "@umbral/contracts";
import { analyzeProject } from "../analyze.js";
import { generateProposals } from "../generate.js";
import { reviewEde } from "../ui.js";
import { setupDatabase } from "../setup/database.js";
import { setupHooks } from "../setup/hooks.js";
import { setupContext } from "../setup/context.js";

interface InitOptions {
  yes?: boolean;
  path?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const projectPath = options.path ?? process.cwd();
  const w = (s: string) => process.stdout.write(s);

  w("\n  Umbral  —  Inicializacion de gobernanza\n\n");
  w("  Analizando proyecto...\n");

  const analysis = analyzeProject(projectPath);

  if (analysis.detections.length === 0) {
    w("  No se detectaron tecnologias en este directorio.\n");
    w("  Puedes crear EDEs manualmente despues.\n\n");
  } else {
    for (const d of analysis.detections) {
      w(`    + ${d.name}\n`);
    }
  }

  const proposals = generateProposals(analysis.detections);

  if (proposals.length === 0) {
    w("\n  No hay propuestas de EDEs para generar.\n");
    w("  Configurando infraestructura base...\n\n");
  } else {
    w(`\n  Propuestas de EDEs (${proposals.length}):\n`);
  }

  const accepted: Ede[] = [];

  for (let i = 0; i < proposals.length; i++) {
    const ede = proposals[i];

    if (options.yes) {
      ede.status = "accepted";
      accepted.push(ede);
      w(`    + ${ede.id}: ${ede.title}\n`);
      continue;
    }

    const result = await reviewEde(ede, i + 1, proposals.length);

    if (result.action === "skip") {
      w("       -- saltado\n");
      continue;
    }

    if (result.edits?.title) ede.title = result.edits.title;
    if (result.edits?.decision) ede.whatAndHow.decision = result.edits.decision;
    if (result.edits?.rationale) ede.why.rationale = result.edits.rationale;

    ede.status = "accepted";
    accepted.push(ede);
    w("       + aceptado\n");
  }

  w("\n  Configurando infraestructura...\n");

  if (accepted.length > 0) {
    const dbResult = setupDatabase(accepted);
    w(`    + ${dbResult.dbPath}\n`);
    w(`    + ${dbResult.saved} EDEs guardadas\n`);
  } else {
    w("    - Sin EDEs para guardar\n");
  }

  setupHooks(projectPath);
  w("    + .claude/settings.json (hooks + MCP)\n");

  setupContext(projectPath);
  w("    + .claude/CLAUDE.md (contexto para Claude)\n");

  w("\n  Umbral listo. Claude Code ahora tiene gobernanza.\n\n");
}
