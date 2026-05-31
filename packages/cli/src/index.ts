import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { hookCommand } from "./commands/hook.js";
import { mcpCommand } from "./commands/mcp.js";
import { startCommand } from "./commands/start.js";
import { stopCommand } from "./commands/stop.js";

const program = new Command();

program
  .name("umbral")
  .description("Umbral — Framework de gobernanza para proyectos con Claude Code")
  .version("0.0.3");

program
  .command("init")
  .description("Inicializar Umbral en el proyecto actual")
  .option("--yes", "Aceptar todas las propuestas sin preguntar")
  .option("--path <path>", "Ruta al proyecto (default: directorio actual)")
  .action(initCommand);

program
  .command("start")
  .description("Levantar la plataforma Umbral (Neo4j + Dashboard web)")
  .option("--port <port>", "Puerto para el dashboard (default: auto)")
  .option("--no-detach", "Correr en primer plano (sin -d)")
  .action(startCommand);

program
  .command("stop")
  .description("Detener la plataforma Umbral")
  .action(stopCommand);

program
  .command("hook <event>")
  .description("Despachar un hook event de Claude Code (stdin/stdout)")
  .action(hookCommand);

program
  .command("mcp")
  .description("Iniciar el servidor MCP de Umbral (transporte stdio)")
  .action(mcpCommand);

program.parse();
