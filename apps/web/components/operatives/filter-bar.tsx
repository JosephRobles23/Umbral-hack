"use client";

import { Search } from "lucide-react";
import { Select } from "@/components/ui";

const LEVEL_OPTIONS = [
  { value: "all", label: "Todos los niveles" },
  { value: "explorer", label: "Explorer" },
  { value: "navigator", label: "Navigator" },
  { value: "anchor", label: "Anchor" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  { value: "accepted", label: "Aceptado" },
  { value: "proposed", label: "Propuesto" },
  { value: "deprecated", label: "Obsoleto" },
];

interface FilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  level: string;
  onLevelChange: (l: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
}

export function FilterBar({
  query,
  onQueryChange,
  level,
  onLevelChange,
  status,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="bg-bg-card border border-bg-elevated rounded-[10px] px-3 py-2 mb-6 flex gap-3 items-center">
      <div className="flex-1 flex items-center gap-2">
        <Search size={16} className="text-text-tertiary shrink-0" />
        <input
          placeholder="Buscar EDEs…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="flex-1 border-none bg-transparent text-sm outline-none text-text-primary placeholder:text-text-tertiary"
        />
      </div>
      <Select
        value={level}
        options={LEVEL_OPTIONS}
        onChange={onLevelChange}
        className="w-[180px]"
      />
      <Select
        value={status}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
        className="w-[180px]"
      />
    </div>
  );
}
