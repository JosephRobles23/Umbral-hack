"use client";

import { useRef, useEffect } from "react";
import { marked } from "marked";
import { Link as LinkIcon, GitMerge } from "lucide-react";
import type { GraftNote } from "@umbral/contracts";

interface NoteViewProps {
  note: GraftNote;
  allNotes: GraftNote[];
  groupColors: Record<string, string>;
  groupLabels: Record<string, string>;
  onOpen: (id: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  dominado: "Dominado",
  solidificando: "Solidificando",
  aprendiendo: "Aprendiendo",
};

const STATUS_CLASSES: Record<string, string> = {
  dominado: "bg-success-subtle text-success border-success",
  solidificando: "bg-warning-subtle text-warning border-warning",
  aprendiendo: "bg-info-subtle text-info border-info",
};

export function NoteView({
  note,
  allNotes,
  groupColors,
  groupLabels,
  onOpen,
}: NoteViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const color = groupColors[note.group] ?? "#9B9590";

  useEffect(() => {
    if (!ref.current) return;
    const md = note.markdown.replace(
      /\[\[([^\]]+)\]\]/g,
      (_m: string, t: string) =>
        `<a class="wikilink" data-title="${t}">${t}</a>`,
    );
    ref.current.innerHTML = marked.parse(md) as string;

    ref.current.querySelectorAll("a.wikilink").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const title = (a as HTMLElement).dataset.title?.trim().toLowerCase();
        const target = allNotes.find(
          (n) => n.title.toLowerCase() === title,
        );
        if (target) onOpen(target.id);
      });
    });
  }, [note.id, note.markdown, allNotes, onOpen]);

  const backlinks = allNotes.filter(
    (n) => n.links.includes(note.id) && n.id !== note.id,
  );
  const outgoing = note.links
    .map((id) => allNotes.find((n) => n.id === id))
    .filter(Boolean) as GraftNote[];

  return (
    <div className="h-full overflow-y-auto px-10 pt-8 pb-16 max-w-[760px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-2 border-b border-bg-elevated">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: color }}
          />
          <div
            className="text-xs uppercase tracking-[0.05em]"
            style={{ color }}
          >
            {groupLabels[note.group] ?? note.group}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_CLASSES[note.status] ?? ""}`}
          >
            {STATUS_LABELS[note.status] ?? note.status}
          </span>
          <span className="font-mono text-[11px] text-text-tertiary">
            solidez {Math.round(note.strength * 100)}%
          </span>
        </div>
      </div>

      {/* Markdown content */}
      <div
        ref={ref}
        className="text-[15px] leading-[1.7] text-text-primary
          [&_h1]:font-display [&_h1]:text-[28px] [&_h1]:font-semibold [&_h1]:tracking-[-0.02em] [&_h1]:mt-[18px] [&_h1]:mb-3
          [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-7 [&_h2]:mb-2.5
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
          [&_p]:my-3
          [&_ul]:my-3 [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:pl-6
          [&_li]:my-1
          [&_blockquote]:my-4 [&_blockquote]:px-[18px] [&_blockquote]:py-2.5 [&_blockquote]:border-l-[3px] [&_blockquote]:border-l-accent [&_blockquote]:bg-accent-subtle [&_blockquote]:rounded-r-lg [&_blockquote]:text-text-secondary [&_blockquote]:italic
          [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:bg-bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-[5px] [&_code]:text-accent-text
          [&_pre]:bg-bg-inverse [&_pre]:text-text-inverse [&_pre]:px-[18px] [&_pre]:py-4 [&_pre]:rounded-[10px] [&_pre]:overflow-x-auto [&_pre]:my-4
          [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0 [&_pre_code]:text-[12.5px] [&_pre_code]:leading-[1.6]
          [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_table]:text-sm
          [&_th]:border [&_th]:border-bg-elevated [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-bg-surface [&_th]:font-semibold
          [&_td]:border [&_td]:border-bg-elevated [&_td]:px-3 [&_td]:py-2 [&_td]:text-left
          [&_a.wikilink]:text-accent-text [&_a.wikilink]:no-underline [&_a.wikilink]:cursor-pointer [&_a.wikilink]:border-b [&_a.wikilink]:border-accent-text/35 [&_a.wikilink]:font-medium [&_a.wikilink]:hover:bg-accent-subtle [&_a.wikilink]:hover:rounded-[3px]
          [&_hr]:border-none [&_hr]:border-t [&_hr]:border-bg-elevated [&_hr]:my-6"
      />

      {/* Links section */}
      <div className="grid grid-cols-2 gap-6 mt-9 pt-6 border-t border-bg-elevated">
        <div className="flex flex-col gap-2 items-start">
          <div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-text-tertiary mb-2.5 flex items-center gap-1">
            <LinkIcon size={12} />
            Enlaces salientes ({outgoing.length})
          </div>
          {outgoing.length === 0 ? (
            <span className="text-xs text-text-tertiary">Ninguno</span>
          ) : (
            outgoing.map((n) => (
              <button
                key={n.id}
                className="inline-flex items-center gap-2 px-3 py-[7px] bg-bg-base border border-bg-elevated rounded-full text-[13px] text-text-primary cursor-pointer transition-all duration-150 hover:border-accent hover:bg-accent-subtle"
                onClick={() => onOpen(n.id)}
              >
                <span
                  className="w-[9px] h-[9px] rounded-full shrink-0"
                  style={{ background: groupColors[n.group] }}
                />
                {n.title}
              </button>
            ))
          )}
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-text-tertiary mb-2.5 flex items-center gap-1">
            <GitMerge size={12} />
            Backlinks ({backlinks.length})
          </div>
          {backlinks.length === 0 ? (
            <span className="text-xs text-text-tertiary">Ninguno</span>
          ) : (
            backlinks.map((n) => (
              <button
                key={n.id}
                className="inline-flex items-center gap-2 px-3 py-[7px] bg-bg-base border border-bg-elevated rounded-full text-[13px] text-text-primary cursor-pointer transition-all duration-150 hover:border-accent hover:bg-accent-subtle"
                onClick={() => onOpen(n.id)}
              >
                <span
                  className="w-[9px] h-[9px] rounded-full shrink-0"
                  style={{ background: groupColors[n.group] }}
                />
                {n.title}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
