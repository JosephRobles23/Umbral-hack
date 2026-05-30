import { C4_LEGEND } from "@/lib/c4-diagrams";

export function C4Legend() {
  return (
    <div className="flex flex-wrap gap-[18px] px-5 py-3.5 border-b border-bg-elevated bg-bg-sidebar">
      {C4_LEGEND.map((l) => (
        <span
          key={l.label}
          className="inline-flex items-center gap-[7px] text-xs text-text-secondary"
        >
          <span
            className="w-3 h-3 rounded-[3px] inline-block"
            style={{ background: l.color }}
          />
          {l.label}
        </span>
      ))}
    </div>
  );
}
