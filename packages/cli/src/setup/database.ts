import { homedir } from "node:os";
import { openDb } from "@umbral/persistence";
import { loadEde, createEdeStore } from "@umbral/persistence";
import type { Ede } from "@umbral/contracts";

export function setupDatabase(edes: Ede[]): { saved: number; dbPath: string } {
  const db = openDb();
  const store = createEdeStore(db);
  let saved = 0;

  for (const ede of edes) {
    const validated = loadEde(ede);
    store.save(validated);
    saved++;
  }

  db.close();
  return { saved, dbPath: `${homedir()}/.umbral/umbral.db` };
}
