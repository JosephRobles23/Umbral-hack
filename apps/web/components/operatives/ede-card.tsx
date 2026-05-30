"use client";

import Link from "next/link";
import type { Ede } from "@umbral/contracts";
import { ComplexityBadge, StatusBadge, Badge } from "@/components/ui";

const LEVEL_LABEL: Record<string, string> = {
  explorer: "EXPLORER",
  navigator: "NAVIGATOR",
  anchor: "ANCHOR",
};

const LEVEL_COLOR: Record<string, string> = {
  explorer: "border-l-level-explorer text-level-explorer",
  navigator: "border-l-level-navigator text-level-navigator",
  anchor: "border-l-level-anchor text-level-anchor",
};

export function EdeCard({ ede, delay = 0 }: { ede: Ede; delay?: number }) {
  const level = ede.cognitiveLevel ?? "anchor";
  const tier = ede.complexityTier ?? 1;

  return (
    <Link
      href={`/operatives/${ede.id}`}
      className={`bg-bg-card border border-bg-elevated border-l-4 rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-px flex flex-col gap-4 text-left no-underline animate-fade-up ${LEVEL_COLOR[level]?.split(" ")[0] ?? ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3.5">
        <ComplexityBadge level={level} tier={tier} />
        <div className="min-w-0">
          <div
            className={`text-[11px] tracking-[0.06em] uppercase font-semibold ${LEVEL_COLOR[level]?.split(" ")[1] ?? "text-accent"}`}
          >
            {LEVEL_LABEL[level] ?? level.toUpperCase()}
          </div>
          <div className="text-base font-semibold leading-[22px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap text-text-primary">
            {ede.title}
          </div>
          <div className="font-mono text-xs text-text-tertiary">{ede.id}</div>
        </div>
      </div>
      <p className="text-sm text-text-secondary m-0 line-clamp-3">
        &quot;{ede.whatAndHow.decision}&quot;
      </p>
      <div className="flex items-center gap-2">
        <StatusBadge status={ede.status} />
        <Badge variant="version">v{ede.version ?? 1}</Badge>
      </div>
    </Link>
  );
}
