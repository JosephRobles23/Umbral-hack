"use client";

const levelColors = {
  explorer: "bg-level-explorer",
  navigator: "bg-level-navigator",
  anchor: "bg-level-anchor",
} as const;

export interface ComplexityBadgeProps {
  level: "explorer" | "navigator" | "anchor";
  tier: number;
  size?: number;
}

export function ComplexityBadge({
  level,
  tier,
  size = 40,
}: ComplexityBadgeProps) {
  return (
    <span
      className={`${levelColors[level]} rounded-full shrink-0 flex items-center justify-center text-white font-mono font-semibold`}
      style={{ width: size, height: size, fontSize: size > 44 ? 15 : 13 }}
    >
      T{tier}
    </span>
  );
}
