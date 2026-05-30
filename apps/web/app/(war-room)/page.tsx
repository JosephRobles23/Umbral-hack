import type { Ede } from "@umbral/contracts";
import { EdeCard } from "@/components/operatives/EdeCard";
import { C4Viewer } from "@/components/c4-viewer/C4Viewer";

async function getEdes(): Promise<Ede[]> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getAll();
}

export default async function WarRoom() {
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
          War Room
        </h1>
        <p style={{ color: "#737373", fontSize: 14 }}>
          Planta de operativos — Decisiones de Estructura Explícita
        </p>
      </header>

      <nav style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <a
          href="/terminal"
          style={{
            padding: "8px 16px",
            backgroundColor: "#f3a93b",
            color: "#0d0c08",
            borderRadius: 4,
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "monospace",
          }}
        >
          Launch Terminal
        </a>
        <a
          href="/grill"
          style={{
            padding: "8px 16px",
            backgroundColor: "#262626",
            color: "#e5e5e5",
            borderRadius: 4,
            textDecoration: "none",
            fontSize: 13,
            fontFamily: "monospace",
          }}
        >
          Grill Me
        </a>
      </nav>

      <section style={{ marginBottom: 32 }}>
        <C4Viewer />
      </section>

      {edes.length === 0 ? (
        <p style={{ color: "#525252" }}>
          Sin EDEs cargadas. Usa POST /api/edes para indexar una.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380, 1fr))",
            gap: 20,
          }}
        >
          {edes.map((ede) => (
            <EdeCard key={ede.id} ede={ede} />
          ))}
        </div>
      )}
    </main>
  );
}
