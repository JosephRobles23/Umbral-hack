"use client";

import { useEffect, useState } from "react";

function colorForPct(pct: number): string {
  if (pct < 31) return "bg-error";
  if (pct < 70) return "bg-warning";
  return "bg-success";
}

export interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  labelFmt?: string;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  showLabel,
  labelFmt,
  className = "",
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className={className}>
      <div className="h-2 rounded bg-bg-elevated overflow-hidden">
        <div
          className={`h-full rounded transition-[width] duration-600 ease-out ${colorForPct(pct)}`}
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1.5">
          <span className="font-mono text-xs text-text-secondary">
            {labelFmt ?? `${value}/${max}`}
          </span>
        </div>
      )}
    </div>
  );
}
