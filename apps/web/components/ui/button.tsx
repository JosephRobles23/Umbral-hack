"use client";

import { forwardRef } from "react";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover active:bg-accent-pressed disabled:bg-bg-muted disabled:text-text-tertiary disabled:cursor-not-allowed disabled:transform-none min-w-[120px]",
  secondary:
    "bg-transparent text-text-primary border border-bg-muted hover:bg-bg-surface hover:border-text-disabled active:bg-bg-elevated",
  ghost:
    "bg-transparent text-text-secondary h-8 px-3 text-xs rounded-sm hover:bg-bg-surface hover:text-text-primary active:bg-bg-elevated",
  danger:
    "bg-transparent text-error border border-error hover:bg-error-subtle active:bg-error active:text-white",
  warning:
    "bg-transparent text-warning border border-warning hover:bg-warning-subtle",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  loading?: boolean;
  icon?: React.ReactNode;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, icon, block, children, className = "", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 text-[13px] font-medium h-10 px-5 rounded-md border-none cursor-pointer transition-all duration-150 select-none whitespace-nowrap active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${variants[variant]} ${block ? "w-full" : ""} ${className}`}
        disabled={loading || rest.disabled}
        {...rest}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin inline-block" />
            Cargando…
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
