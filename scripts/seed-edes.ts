import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { openDb } from "../packages/persistence/src/db";
import { loadEde, createEdeStore } from "../packages/persistence/src/ede-store";

const edesDir = join(import.meta.dirname, "..", "umbral-docs", "edes");
const files = readdirSync(edesDir).filter((f) => f.endsWith(".ede.json"));

const db = openDb();
const store = createEdeStore(db);
let loaded = 0;

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(edesDir, file), "utf-8"));
  const ede = loadEde(raw);
  store.save(ede);
  loaded++;
  console.log(`  + ${ede.id}`);
}

console.log(`\nSeeded ${loaded} EDEs into ~/.umbral/umbral.db`);
db.close();
