import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const COMPOSE_PATH = join(homedir(), ".umbral", "docker-compose.yml");

export function stopCommand(): void {
  const w = (s: string) => process.stdout.write(s);

  w("\n  Umbral  —  Deteniendo plataforma\n\n");

  if (!existsSync(COMPOSE_PATH)) {
    w("  ✗ No se encontro docker-compose.yml en ~/.umbral/\n");
    w("    Ejecuta 'umbral start' primero.\n\n");
    process.exit(1);
  }

  try {
    execSync(`docker compose -f "${COMPOSE_PATH}" down`, {
      stdio: "inherit",
    });
    w("\n  ✓ Servicios detenidos.\n\n");
  } catch {
    w("\n  ✗ Error al detener los servicios.\n\n");
    process.exit(1);
  }
}
