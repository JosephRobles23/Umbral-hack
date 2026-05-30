"use client";

import { useEffect, useState } from "react";
import type { C4Model, C4RegenTrigger, C4Layer } from "@umbral/contracts";
import { StatusDot, Badge } from "@/components/ui";

const LAYER_COLORS: Record<C4Layer, string> = {
  system: "border-layer-system",
  container: "border-layer-container",
  component: "border-layer-component",
  code: "border-layer-code",
};

const LAYER_TEXT: Record<C4Layer, string> = {
  system: "text-layer-system",
  container: "text-layer-container",
  component: "text-layer-component",
  code: "text-layer-code",
};

const LAYER_BG: Record<C4Layer, string> = {
  system: "bg-[#E8EAFC] dark:bg-[#2a2950]",
  container: "bg-[#E0F2FE] dark:bg-[#1a3040]",
  component: "bg-[#E7F8F1] dark:bg-[#1a3530]",
  code: "bg-[#F5E6DE] dark:bg-[#352a22]",
};

const LAYER_LABELS: Record<C4Layer, string> = {
  system: "System (L5)",
  container: "Container (L4)",
  component: "Component (L2/L3)",
  code: "Code (L1)",
};

const LAYER_ORDER: C4Layer[] = ["system", "container", "component", "code"];

export function C4Viewer() {
  const [model, setModel] = useState<C4Model | null>(null);
  const [lastAffected, setLastAffected] = useState<C4Layer[]>([]);
  const [connected, setConnected] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/events");

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.onmessage = (event) => {
      const trigger: C4RegenTrigger = JSON.parse(event.data);
      setModel(trigger.model);
      setLastAffected(trigger.affectedLayers);
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    };

    return () => es.close();
  }, []);

  const groupedByLayer = LAYER_ORDER.map((layer) => ({
    layer,
    elements: model?.elements.filter((e) => e.layer === layer) ?? [],
  })).filter((g) => g.elements.length > 0);

  return (
    <div className="rounded-lg border border-bg-elevated overflow-hidden bg-bg-card shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3.5 border-b border-bg-elevated">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          C4 Model — Auto-generado
        </h2>
        <StatusDot
          variant={connected ? "success" : "error"}
          label={connected ? "SSE conectado" : "Desconectado"}
          pulse={connected}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {!model ? (
          <p className="text-text-tertiary text-sm">
            Sin modelo C4. Presiona &ldquo;Regenerar&rdquo; para generar el modelo.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedByLayer.map(({ layer, elements }) => {
              const isAffected = lastAffected.includes(layer);
              return (
                <div
                  key={layer}
                  className={`rounded-md border p-3 transition-colors duration-300 ${
                    isAffected && flash
                      ? LAYER_COLORS[layer]
                      : "border-bg-elevated"
                  }`}
                >
                  <h3 className={`text-[13px] font-semibold mb-2 ${LAYER_TEXT[layer]}`}>
                    {LAYER_LABELS[layer]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {elements.map((el) => (
                      <div
                        key={el.id}
                        className={`rounded-md border border-bg-elevated px-3 py-2 min-w-[140px] ${LAYER_BG[layer]}`}
                      >
                        <div className="font-semibold text-xs text-text-primary mb-0.5">
                          {el.name}
                        </div>
                        <div className="text-[11px] text-text-tertiary">
                          {el.description}
                        </div>
                        {el.relationships.length > 0 && (
                          <div className="mt-1 text-[10px] text-text-tertiary">
                            {el.relationships.map((r) => (
                              <Badge
                                key={r.targetId}
                                variant="neutral"
                                className="mr-1 mt-1 text-[10px] py-0 px-1.5"
                              >
                                → {r.targetId}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="text-[11px] text-text-tertiary">
              Última actualización: {model.lastUpdated}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
