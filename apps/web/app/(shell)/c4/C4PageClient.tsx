"use client";

import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { Tabs, Button, useToast } from "@/components/ui";
import { MermaidDiagram } from "@/components/c4/mermaid-diagram";
import { C4Legend } from "@/components/c4/c4-legend";
import { C4_DIAGRAMS } from "@/lib/c4-diagrams";

const TABS = C4_DIAGRAMS.map((d) => ({ id: d.id, label: d.label }));

const ALL_PATHS = [
  "packages/persistence",
  "packages/contracts",
  "packages/orchestrator",
  "apps/web/app/api",
  "apps/web/app",
];

export function C4PageClient() {
  const [view, setView] = useState("capas");
  const [updated, setUpdated] = useState("hace 2 minutos");
  const [nonce, setNonce] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const current = C4_DIAGRAMS.find((d) => d.id === view) ?? C4_DIAGRAMS[0];

  async function regen() {
    setLoading(true);
    try {
      const res = await fetch("/api/doc-regen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affectedPaths: ALL_PATHS }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Error ${res.status}`);
      }
      toast({ message: "Modelo C4 regenerado", variant: "success" });
      setUpdated("hace unos segundos");
      setNonce((n) => n + 1);
    } catch (e) {
      toast({
        message: `Error al regenerar: ${e instanceof Error ? e.message : "desconocido"}`,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Tabs tabs={TABS} active={view} onChange={setView} className="mb-0 border-b-0" />
        <Button
          variant="secondary"
          onClick={regen}
          loading={loading}
          icon={<RefreshCw size={16} />}
        >
          Regenerar
        </Button>
      </div>

      <p className="text-sm text-text-secondary mb-4">{current.desc}</p>

      <div className="bg-bg-card border border-bg-elevated rounded-lg overflow-hidden shadow-sm">
        <C4Legend />
        <div className="p-7 flex justify-center overflow-x-auto min-h-[280px] items-center">
          <MermaidDiagram key={`${view}-${nonce}`} def={current.def} />
        </div>
      </div>

      <div className="text-xs text-text-tertiary mt-3 flex items-center gap-1.5">
        <Sparkles size={13} />
        Diagrama derivado de los operativos · última actualización: {updated}
      </div>
    </>
  );
}
