import type { Ede } from "@umbral/contracts";
import { TerminalLauncher } from "./TerminalLauncher";

async function getEdes(): Promise<Ede[]> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getAll();
}

export default async function TerminalPage() {
  const edes = await getEdes();

  return (
    <div className="bg-term-bg min-h-screen p-8">
      <TerminalLauncher edes={edes} />
    </div>
  );
}
