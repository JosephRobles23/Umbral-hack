"use client";

export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div
      className={`border-b border-bg-elevated mb-6 flex gap-0 ${className}`}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`px-5 py-3 text-[13px] font-medium border-b-2 -mb-px cursor-pointer transition-all duration-150 bg-transparent ${
            t.id === active
              ? "text-accent-text border-accent"
              : "text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-surface"
          }`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
