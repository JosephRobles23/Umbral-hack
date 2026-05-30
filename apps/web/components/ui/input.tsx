"use client";

import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-10 px-3 bg-bg-card border border-bg-muted rounded-md font-body text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-150 hover:border-text-disabled focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(218,119,86,0.15)] disabled:bg-bg-base disabled:border-bg-elevated disabled:text-text-disabled ${error ? "border-error shadow-[0_0_0_3px_rgba(193,58,49,0.10)]" : ""} ${className}`}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
