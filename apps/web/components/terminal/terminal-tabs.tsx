"use client";

import { Plus, X } from "lucide-react";

export interface TerminalTab {
  id: string;
  label: string;
}

interface TerminalTabsProps {
  tabs: TerminalTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
}

export function TerminalTabs({
  tabs,
  activeId,
  onSelect,
  onClose,
  onNew,
}: TerminalTabsProps) {
  return (
    <div className="h-8 bg-term-bg border-b border-term-border px-2 flex items-end gap-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`h-7 px-4 bg-transparent font-mono text-[11px] rounded-t-md border border-transparent cursor-pointer flex items-center gap-2 group ${
            tab.id === activeId
              ? "bg-term-surface text-term-text border-term-border border-b-transparent"
              : "text-term-dim hover:bg-term-surface/50"
          }`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
          <span
            className="inline-flex text-term-dim opacity-0 group-hover:opacity-100 hover:bg-term-border rounded p-0.5 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
          >
            <X size={10} />
          </span>
        </button>
      ))}
      <button
        className="w-8 h-7 bg-transparent text-term-dim border-none rounded-t-md cursor-pointer text-base hover:bg-term-surface hover:text-term-text flex items-center justify-center"
        onClick={onNew}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
