"use client";

import { useState } from "react";
import type { Ede, GrillSession } from "@umbral/contracts";
import { GrillPanel } from "@/components/grill/GrillPanel";
import { Button, Select } from "@/components/ui";

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
    <div className="max-w-[500px]">
      <label className="block text-xs font-medium text-text-secondary mb-1.5">
        Selecciona la EDE a evaluar:
      </label>
      <Select
        value={selectedEde}
        options={edes.map((ede) => ({
          value: ede.id,
          label: `${ede.id} — ${ede.title}`,
        }))}
        onChange={setSelectedEde}
        className="mb-4"
      />
      <Button onClick={startSession} loading={loading}>
        Iniciar sesión Grill Me
      </Button>
    </div>
  );
}
