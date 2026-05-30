"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  dark?: boolean;
  className?: string;
}

export function Select({
  value,
  options,
  onChange,
  placeholder = "Seleccionar…",
  dark,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = options.find((o) => o.value === value);

  const triggerBase = dark
    ? "bg-term-bg border-term-border text-term-text"
    : "bg-bg-card border-bg-muted text-text-primary";

  const menuBase = dark
    ? "bg-term-surface border-term-border"
    : "bg-bg-card border-bg-muted";

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={`w-full h-10 px-3 rounded-md border text-sm flex items-center justify-between gap-2 cursor-pointer text-left transition-all duration-150 ${triggerBase} ${open ? "border-accent shadow-[0_0_0_3px_rgba(218,119,86,0.15)]" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {current ? current.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-tertiary shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className={`absolute top-[calc(100%+4px)] left-0 right-0 z-30 border rounded-md shadow-md max-h-60 overflow-y-auto p-1 animate-drop-in ${menuBase}`}
        >
          {options.map((o) => (
            <div
              key={o.value}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-sm cursor-pointer text-sm ${
                o.value === value
                  ? "bg-accent-subtle text-accent-text"
                  : dark
                    ? "text-term-text hover:bg-term-bg"
                    : "hover:bg-bg-base"
              }`}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {o.label}
              </span>
              {o.value === value && (
                <Check size={16} className="text-accent shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
