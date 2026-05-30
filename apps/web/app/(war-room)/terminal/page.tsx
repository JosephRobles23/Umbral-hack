import type { Ede } from "@umbral/contracts";
import { TerminalLauncher } from "./TerminalLauncher";

async function getEdes(): Promise<Ede[]> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getAll();
}

export default async function TerminalPage() {
  const edes = await getEdes();

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "#e5e5e5",
        padding: 40,
        fontFamily: "system-ui, monospace",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
          Terminal
        </h1>
        <p style={{ color: "#737373", fontSize: 14 }}>
          Interactive Claude Code session with Umbral governance
        </p>
      </header>

      <TerminalLauncher edes={edes} />
    </main>
  );
}
