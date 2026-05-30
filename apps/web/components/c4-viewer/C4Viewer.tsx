"use client";

import { useEffect, useState } from "react";
import type { C4Model, C4RegenTrigger, C4Layer } from "@umbral/contracts";

const LAYER_COLORS: Record<C4Layer, string> = {
  system: "#6366f1",
  container: "#0ea5e9",
  component: "#10b981",
  code: "#f59e0b",
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
    <div
      style={{
        border: "1px solid #262626",
        borderRadius: 8,
        padding: 20,
        backgroundColor: "#0a0a0a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
          C4 Model — Auto-generado
        </h2>
        <span
          style={{
            fontSize: 11,
            color: connected ? "#22c55e" : "#ef4444",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: connected ? "#22c55e" : "#ef4444",
              display: "inline-block",
            }}
          />
          {connected ? "SSE conectado" : "Desconectado"}
        </span>
      </div>

      {!model ? (
        <p style={{ color: "#525252", fontSize: 14 }}>
          Sin modelo C4. Envía POST /api/doc-regen para generar.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groupedByLayer.map(({ layer, elements }) => {
            const isAffected = lastAffected.includes(layer);
            return (
              <div
                key={layer}
                style={{
                  border: `1px solid ${isAffected && flash ? LAYER_COLORS[layer] : "#262626"}`,
                  borderRadius: 6,
                  padding: 12,
                  transition: "border-color 0.3s ease",
                }}
              >
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: LAYER_COLORS[layer],
                    margin: 0,
                    marginBottom: 8,
                  }}
                >
                  {LAYER_LABELS[layer]}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {elements.map((el) => (
                    <div
                      key={el.id}
                      style={{
                        backgroundColor: "#171717",
                        border: `1px solid ${LAYER_COLORS[layer]}33`,
                        borderRadius: 4,
                        padding: "8px 12px",
                        fontSize: 12,
                        minWidth: 140,
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>
                        {el.name}
                      </div>
                      <div style={{ color: "#737373", fontSize: 11 }}>
                        {el.description}
                      </div>
                      {el.relationships.length > 0 && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 10,
                            color: "#525252",
                          }}
                        >
                          {el.relationships.map((r) => (
                            <span key={r.targetId}>→ {r.targetId} </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 11, color: "#525252" }}>
            Última actualización: {model.lastUpdated}
          </div>
        </div>
      )}
    </div>
  );
}
