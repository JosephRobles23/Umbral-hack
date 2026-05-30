"use client";

const variants = {
  success: "bg-success-subtle text-success border-success",
  warning: "bg-warning-subtle text-warning border-warning",
  error: "bg-error-subtle text-error border-error",
  info: "bg-info-subtle text-info border-info",
  neutral: "bg-bg-base text-text-secondary border-bg-muted",
  version: "bg-bg-base text-text-tertiary border-transparent font-mono text-[11px] px-2",
} as const;

export interface BadgeProps {
  variant?: keyof typeof variants;
  upper?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  upper,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap border ${variants[variant]} ${upper ? "uppercase" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
