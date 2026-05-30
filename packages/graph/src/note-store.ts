import type { GraftNote, GraftLink, GraftGraph, GraftFolder } from "@umbral/contracts";
import { getDriver } from "./connection";

const GROUP_COLORS: Record<string, string> = {
  fundamentos: "#0EA5E9",
  gobernanza: "#8B5CF6",
  arquitectura: "#10B981",
  seguridad: "#C13A31",
  busqueda: "#C17E2F",
};

const GROUP_LABELS: Record<string, string> = {
  fundamentos: "Fundamentos",
  gobernanza: "Gobernanza",
  arquitectura: "Arquitectura",
  seguridad: "Seguridad",
  busqueda: "Búsqueda",
};

export async function createNote(note: GraftNote): Promise<void> {
  const session = getDriver().session();
  try {
    await session.run(
      `CREATE (n:Note {
        id: $id, title: $title, folder: $folder, grp: $group,
        strength: $strength, status: $status, markdown: $markdown
      })`,
      { ...note, group: note.group },
    );
    for (const linkId of note.links) {
      await session.run(
        `MATCH (a:Note {id: $from}), (b:Note {id: $to})
         MERGE (a)-[:LINKS_TO]->(b)`,
        { from: note.id, to: linkId },
      );
    }
  } finally {
    await session.close();
  }
}

export async function getNote(id: string): Promise<GraftNote | null> {
  const session = getDriver().session();
  try {
    const result = await session.run(
      `MATCH (n:Note {id: $id})
       OPTIONAL MATCH (n)-[:LINKS_TO]->(linked:Note)
       RETURN n, collect(linked.id) AS links`,
      { id },
    );
    if (result.records.length === 0) return null;
    const rec = result.records[0];
    const props = rec.get("n").properties;
    return {
      id: props.id,
      title: props.title,
      folder: props.folder,
      group: props.grp,
      strength: typeof props.strength === "object" ? props.strength.toNumber() : props.strength,
      status: props.status,
      markdown: props.markdown,
      links: rec.get("links").filter(Boolean),
    };
  } finally {
    await session.close();
  }
}

export async function getAllNotes(): Promise<GraftNote[]> {
  const session = getDriver().session();
  try {
    const result = await session.run(
      `MATCH (n:Note)
       OPTIONAL MATCH (n)-[:LINKS_TO]->(linked:Note)
       RETURN n, collect(linked.id) AS links
       ORDER BY n.folder, n.title`,
    );
    return result.records.map((rec) => {
      const props = rec.get("n").properties;
      return {
        id: props.id,
        title: props.title,
        folder: props.folder,
        group: props.grp,
        strength: typeof props.strength === "object" ? props.strength.toNumber() : props.strength,
        status: props.status,
        markdown: props.markdown,
        links: rec.get("links").filter(Boolean),
      };
    });
  } finally {
    await session.close();
  }
}

export async function getGraph(): Promise<GraftGraph> {
  const notes = await getAllNotes();
  const noteIds = new Set(notes.map((n) => n.id));
  const seen = new Set<string>();
  const links: GraftLink[] = [];

  for (const note of notes) {
    for (const target of note.links) {
      if (!noteIds.has(target)) continue;
      const key = [note.id, target].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({ source: note.id, target });
    }
  }

  return {
    notes,
    links,
    groupColors: GROUP_COLORS,
    groupLabels: GROUP_LABELS,
  };
}

export async function getFolders(): Promise<GraftFolder[]> {
  const notes = await getAllNotes();
  const map = new Map<string, { id: string; title: string }[]>();
  for (const n of notes) {
    const folder = n.folder || "Sin carpeta";
    if (!map.has(folder)) map.set(folder, []);
    map.get(folder)!.push({ id: n.id, title: n.title });
  }
  return Array.from(map.entries()).map(([name, children]) => ({
    name,
    children,
  }));
}

export async function deleteNote(id: string): Promise<void> {
  const session = getDriver().session();
  try {
    await session.run(`MATCH (n:Note {id: $id}) DETACH DELETE n`, { id });
  } finally {
    await session.close();
  }
}

export async function updateNote(
  id: string,
  updates: Partial<Omit<GraftNote, "id">>,
): Promise<void> {
  const session = getDriver().session();
  const txn = session.beginTransaction();
  try {
    const sets: string[] = [];
    const params: Record<string, unknown> = { id };
    if (updates.title !== undefined) { sets.push("n.title = $title"); params.title = updates.title; }
    if (updates.folder !== undefined) { sets.push("n.folder = $folder"); params.folder = updates.folder; }
    if (updates.group !== undefined) { sets.push("n.grp = $grp"); params.grp = updates.group; }
    if (updates.strength !== undefined) { sets.push("n.strength = $strength"); params.strength = updates.strength; }
    if (updates.status !== undefined) { sets.push("n.status = $status"); params.status = updates.status; }
    if (updates.markdown !== undefined) { sets.push("n.markdown = $markdown"); params.markdown = updates.markdown; }

    if (sets.length > 0) {
      await txn.run(
        `MATCH (n:Note {id: $id}) SET ${sets.join(", ")}`,
        params,
      );
    }

    if (updates.links !== undefined) {
      await txn.run(`MATCH (n:Note {id: $id})-[r:LINKS_TO]->() DELETE r`, { id });
      for (const linkId of updates.links) {
        await txn.run(
          `MATCH (a:Note {id: $from}), (b:Note {id: $to})
           MERGE (a)-[:LINKS_TO]->(b)`,
          { from: id, to: linkId },
        );
      }
    }

    await txn.commit();
  } catch (e) {
    await txn.rollback();
    throw e;
  } finally {
    await session.close();
  }
}
