"use client";

import { useState } from "react";
import { Send, AlertTriangle } from "lucide-react";
import type { GrillSession } from "@umbral/contracts";
import { Button, Badge, Progress, Input } from "@/components/ui";

const STATUS_MAP: Record<string, { variant: "success" | "warning" | "error" | "info"; label: string }> = {
  in_progress: { variant: "info", label: "EN PROGRESO" },
  aligned: { variant: "success", label: "ALINEADO" },
  overridden: { variant: "warning", label: "ANULADO" },
  blocked: { variant: "error", label: "BLOQUEADO" },
};

const LEVEL_COLORS: Record<string, string> = {
  explorer: "text-level-explorer",
  navigator: "text-level-navigator",
  anchor: "text-level-anchor",
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
    }
  };

  const status = STATUS_MAP[session.status] ?? STATUS_MAP.in_progress;
  const done = session.status === "aligned" || session.status === "overridden";
  const pct = Math.min(100, (session.alignmentScore / session.threshold) * 100);

  return (
    <div className="max-w-[700px] animate-page-in">
      {/* Score section */}
      <div className="mb-8 max-w-[520px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-text-secondary tracking-wide">
            Puntuación de alineación
          </span>
          <span className="font-mono text-sm font-semibold text-text-primary">
            {session.alignmentScore}/{session.threshold}
          </span>
        </div>
        <Progress value={session.alignmentScore} max={session.threshold} />
        <div className="mt-2.5">
          <Badge variant={status.variant} upper>
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Question cards */}
      <div className="flex flex-col gap-4">
        {session.rounds.map((round, i) => {
          const levelColor = LEVEL_COLORS[round.question.cognitiveLevel] ?? "text-text-tertiary";
          const answered = round.score !== null;

          return (
            <div
              key={round.question.id}
              className={`rounded-lg p-6 shadow-sm border transition-colors duration-300 animate-fade-up ${
                answered
                  ? "bg-bg-sidebar border-bg-elevated"
                  : "bg-bg-card border-bg-elevated"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Level overline */}
              <div className={`text-[11px] uppercase tracking-[0.06em] font-semibold mb-1 ${levelColor}`}>
                {round.question.cognitiveLevel} — {round.question.topic}
              </div>

              {/* Question text */}
              <p className="text-[15px] leading-relaxed text-text-primary mb-4">
                &ldquo;{round.question.text}&rdquo;
              </p>

              {answered ? (
                <div>
                  <div className="text-xs font-medium text-text-tertiary mb-1">
                    Tu respuesta
                  </div>
                  <p className="text-[13px] text-text-secondary mb-3">
                    {round.answer}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        round.score! >= 70
                          ? "success"
                          : round.score! >= 50
                            ? "warning"
                            : "error"
                      }
                      className="font-mono font-semibold"
                    >
                      {round.score}/100
                    </Badge>
                    <span className="text-[13px] text-text-secondary italic">
                      {round.feedback}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Input
                    placeholder="Tu respuesta…"
                    value={answers[round.question.id] ?? ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [round.question.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAnswer(round.question.id);
                    }}
                    disabled={done}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleAnswer(round.question.id)}
                    disabled={done || submitting === round.question.id}
                    loading={submitting === round.question.id}
                    icon={submitting !== round.question.id ? <Send size={15} /> : undefined}
                  >
                    Enviar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Override section */}
      {!done && session.alignmentScore > 0 && (
        <div className="mt-6 rounded-lg border border-warning bg-warning-subtle p-5">
          <div className="flex gap-2.5 mb-3.5">
            <span className="text-warning inline-flex shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </span>
            <span className="text-[13px] text-text-secondary">
              ¿No logras alinear? Puedes anular, pero quedará registrado como{" "}
              <strong className="text-text-primary">deuda cognitiva</strong>.
            </span>
          </div>
          <Button variant="warning" onClick={handleOverride}>
            Anular (registrar deuda)
          </Button>
        </div>
      )}

      {/* Debt notice */}
      {session.status === "overridden" && (
        <div className="mt-4 rounded-lg border border-warning bg-warning-subtle p-4">
          <span className="text-[13px] text-warning">
            Deuda cognitiva registrada: brecha de{" "}
            {session.threshold - session.alignmentScore} puntos. Esta decisión
            continúa bajo observación.
          </span>
        </div>
      )}

      {/* Unresolved gaps */}
      {session.unresolvedGaps.length > 0 && !done && (
        <div className="mt-4">
          <p className="text-xs text-error">
            Gaps sin resolver: {session.unresolvedGaps.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
