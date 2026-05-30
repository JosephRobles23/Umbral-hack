"use client";

const dotColors = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  error: "bg-error",
  muted: "bg-bg-muted",
} as const;

export interface StatusDotProps {
  variant?: keyof typeof dotColors;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  variant = "muted",
  label,
  pulse,
  className = "",
}: StatusDotProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${dotColors[variant]} ${pulse ? "animate-pulse" : ""}`}
      />
      {label}
    </span>
  );
}
