"use client";

import { useState } from "react";
import type { GrillSession } from "@umbral/contracts";

const statusColors: Record<string, string> = {
  in_progress: "#3b82f6",
  aligned: "#22c55e",
  overridden: "#f59e0b",
  blocked: "#ef4444",
};

const statusLabels: Record<string, string> = {
  in_progress: "EN PROGRESO",
  aligned: "ALINEADO",
  overridden: "OVERRIDE",
  blocked: "BLOQUEADO",
};

export function GrillPanel({ initial }: { initial: GrillSession }) {
  const [session, setSession] = useState(initial);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleAnswer = async (questionId: string) => {
    const answer = answers[questionId];
    if (!answer?.trim()) return;
    setSubmitting(questionId);

    const res = await fetch(`/api/grill/${session.id}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer }),
    });
    const updated = await res.json();
    setSession(updated);
    setSubmitting(null);
  };

  const handleOverride = async () => {
    const res = await fetch(`/api/grill/${session.id}/override`, {
      method: "POST",
    });
    const data = await res.json();
    if (res.ok) {
      setSession(data.session);
    } else {
      alert(data.error);
    }
  };

  const color = statusColors[session.status] ?? "#6b7280";
  const done = session.status === "aligned" || session.status === "overridden";

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Score bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#a3a3a3" }}>Alignment Score</span>
          <span style={{ fontSize: 13, fontWeight: 600, color }}>
            {session.alignmentScore}/{session.threshold}
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 4, backgroundColor: "#262626" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              backgroundColor: color,
              width: `${Math.min(100, (session.alignmentScore / session.threshold) * 100)}%`,
              transition: "width 0.3s",
            }}
          />
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color }}>
          {statusLabels[session.status]}
        </div>
      </div>

      {/* Rounds */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {session.rounds.map((round) => (
          <div
            key={round.question.id}
            style={{
              border: "1px solid #333",
              borderRadius: 8,
              padding: 16,
              backgroundColor: round.score !== null ? "#111" : "#0a0a0a",
            }}
          >
            <div style={{ fontSize: 11, color: "#737373", marginBottom: 4 }}>
              {round.question.cognitiveLevel.toUpperCase()} — {round.question.topic}
            </div>
            <p style={{ fontSize: 15, marginBottom: 12, lineHeight: 1.5 }}>
              {round.question.text}
            </p>

            {round.score !== null ? (
              <div>
                <p style={{ fontSize: 13, color: "#a3a3a3", marginBottom: 4 }}>
                  Tu respuesta: {round.answer}
                </p>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 4,
                      backgroundColor: round.score >= 70 ? "#166534" : round.score >= 50 ? "#78350f" : "#7f1d1d",
                      color: "#fff",
                    }}
                  >
                    {round.score}/100
                  </span>
                  <span style={{ fontSize: 12, color: "#a3a3a3" }}>{round.feedback}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  placeholder="Tu respuesta..."
                  value={answers[round.question.id] ?? ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [round.question.id]: e.target.value })
                  }
                  disabled={done}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #333",
                    backgroundColor: "#111",
                    color: "#e5e5e5",
                    fontSize: 14,
                  }}
                />
                <button
                  onClick={() => handleAnswer(round.question.id)}
                  disabled={done || submitting === round.question.id}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    cursor: done ? "not-allowed" : "pointer",
                    fontSize: 13,
                  }}
                >
                  {submitting === round.question.id ? "..." : "Enviar"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Override button */}
      {!done && session.alignmentScore > 0 && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #78350f", borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: "#f59e0b", marginBottom: 8 }}>
            ¿No puedes alinear? Puedes hacer override, pero se registrará como deuda cognitiva.
          </p>
          <button
            onClick={handleOverride}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #f59e0b",
              backgroundColor: "transparent",
              color: "#f59e0b",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Override (registrar deuda)
          </button>
        </div>
      )}

      {/* Debt notice */}
      {session.status === "overridden" && (
        <div style={{ marginTop: 16, padding: 12, backgroundColor: "#1c1917", borderRadius: 8, border: "1px solid #78350f" }}>
          <p style={{ fontSize: 13, color: "#f59e0b" }}>
            Deuda cognitiva registrada: gap de {session.threshold - session.alignmentScore} puntos.
          </p>
        </div>
      )}

      {/* Gaps */}
      {session.unresolvedGaps.length > 0 && !done && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, color: "#ef4444" }}>
            Gaps sin resolver: {session.unresolvedGaps.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
