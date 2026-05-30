import type { Ede } from "@umbral/contracts";

const levelColor: Record<string, string> = {
  explorer: "#22d3ee",
  navigator: "#a78bfa",
  anchor: "#f59e0b",
};

const statusLabel: Record<string, string> = {
  proposed: "PROPUESTA",
  accepted: "ACEPTADA",
  deprecated: "DEPRECADA",
};

export function EdeCard({ ede }: { ede: Ede }) {
  const color = levelColor[ede.cognitiveLevel] ?? "#6b7280";

  return (
    <div
      style={{
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: 20,
        backgroundColor: "#0a0a0a",
        color: "#e5e5e5",
        maxWidth: 420,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#0a0a0a",
          }}
        >
          T{ede.complexityTier}
        </div>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", color, letterSpacing: 1 }}>
            {ede.cognitiveLevel}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{ede.title}</div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#a3a3a3", marginBottom: 8 }}>
        {ede.id}
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>
        {ede.whatAndHow.decision}
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 4,
            backgroundColor: ede.status === "accepted" ? "#166534" : "#78350f",
            color: "#fff",
          }}
        >
          {statusLabel[ede.status] ?? ede.status}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 4,
            backgroundColor: "#1e293b",
            color: "#94a3b8",
          }}
        >
          v{ede.version}
        </span>
      </div>
    </div>
  );
}
