import type { Ede } from "@umbral/contracts";

export function assembleClaudeContext(edes: Ede[]): string {
  const accepted = edes.filter((e) => e.status === "accepted");
  const sections: string[] = [];

  sections.push("# Umbral — Contexto del Proyecto\n");
  sections.push("> Auto-generado por Umbral. No editar manualmente.\n");

  if (accepted.length === 0) {
    sections.push("No hay EDEs activas.\n");
    return sections.join("\n");
  }

  sections.push("## Decisiones Activas (EDEs)\n");
  sections.push("Estas decisiones son vinculantes. Respétalas en todo código que generes.\n");

  for (const ede of accepted) {
    sections.push(`### ${ede.id}: ${ede.title}\n`);
    sections.push(`**Decisión:** ${ede.whatAndHow.decision}\n`);
    sections.push(`**Mecanismo:** ${ede.whatAndHow.mechanism}\n`);
    sections.push(`**Rationale:** ${ede.why.rationale}\n`);

    if (ede.whatNotToDo.antiPatterns.length > 0) {
      sections.push("**Anti-patterns (PROHIBIDO):**");
      for (const ap of ede.whatNotToDo.antiPatterns) {
        sections.push(`- ${ap}`);
      }
      sections.push("");
    }

    if (ede.contracts.layerContracts.length > 0) {
      sections.push(
        `**Contratos de capa:** ${ede.contracts.layerContracts.join(", ")}\n`,
      );
    }
  }

  sections.push("## Reglas Generales\n");
  sections.push("- Fail-fast (S13): todo error de validación debe lanzar inmediatamente, nunca degradar en silencio.");
  sections.push("- Fuente única (S2): solo S2 detecta cambios. Otros subsistemas reaccionan al DocRegenEvent.");
  sections.push("- Local-first: la base de datos vive en ~/.umbral/umbral.db (SQLite con FTS5 + sqlite-vec).");
  sections.push("- No agregar dependencias externas sin justificación en una EDE.");
  sections.push("");

  return sections.join("\n");
}
