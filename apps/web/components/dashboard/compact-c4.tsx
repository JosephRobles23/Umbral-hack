"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusDot } from "@/components/ui";

const C4_LAYERS = [
  {
    label: "L5 · SISTEMA",
    color: "#6366F1",
    elements: ["frontend", "api"],
  },
  {
    label: "L4 · CONTENEDORES",
    color: "#0EA5E9",
    elements: ["bff", "worker", "sse-hub"],
  },
  {
    label: "L2/L3 · COMPONENTES",
    color: "#10B981",
    elements: ["motor-políticas", "regenerador-c4", "índice-fts", "auth"],
  },
  {
    label: "L1 · CÓDIGO",
    color: "#DA7756",
    elements: ["repositorio", "migraciones", "dsl-políticas"],
  },
];

export function CompactC4() {
  return (
    <div className="bg-bg-card border border-bg-elevated rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold leading-6 m-0">
          Arquitectura C4
        </h2>
        <StatusDot variant="success" label="SSE conectado" />
      </div>
      <div className="flex flex-col gap-2.5">
        {C4_LAYERS.map((layer) => (
          <div
            key={layer.label}
            className="flex items-center gap-3.5 py-2.5 pl-3.5"
            style={{ borderLeft: `3px solid ${layer.color}` }}
          >
            <span
              className="text-[11px] tracking-[0.06em] uppercase font-semibold w-[120px] shrink-0"
              style={{ color: layer.color }}
            >
              {layer.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {layer.elements.map((el) => (
                <span
                  key={el}
                  className="font-mono text-[11px] bg-bg-base border border-bg-elevated rounded-md px-2 py-0.5 text-text-secondary"
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/c4"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary px-3 h-8 rounded-sm mt-3.5 no-underline transition-all duration-150"
      >
        Ver modelo completo <ArrowRight size={14} />
      </Link>
    </div>
  );
}
