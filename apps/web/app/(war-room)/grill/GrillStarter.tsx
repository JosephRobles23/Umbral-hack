"use client";

import { useState } from "react";
import type { Ede, GrillSession } from "@umbral/contracts";
import { GrillPanel } from "@/components/grill/GrillPanel";

export function GrillStarter({ edes }: { edes: Ede[] }) {
  const [session, setSession] = useState<GrillSession | null>(null);
  const [selectedEde, setSelectedEde] = useState(edes[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    const res = await fetch("/api/grill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ edeId: selectedEde }),
    });
    const data = await res.json();
    setSession(data);
    setLoading(false);
  };

  if (session) {
    return <GrillPanel initial={session} />;
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <label style={{ fontSize: 14, color: "#a3a3a3", display: "block", marginBottom: 8 }}>
        Selecciona la EDE a evaluar:
      </label>
      <select
        value={selectedEde}
        onChange={(e) => setSelectedEde(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 6,
          border: "1px solid #333",
          backgroundColor: "#111",
          color: "#e5e5e5",
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        {edes.map((ede) => (
          <option key={ede.id} value={ede.id}>
            {ede.id} — {ede.title}
          </option>
        ))}
      </select>

      <button
        onClick={startSession}
        disabled={loading}
        style={{
          padding: "10px 24px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#3b82f6",
          color: "#fff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {loading ? "Iniciando..." : "Iniciar sesión Grill Me"}
      </button>
    </div>
  );
}
