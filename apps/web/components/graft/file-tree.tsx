"use client";

import { useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
} from "lucide-react";
import type { GraftNote } from "@umbral/contracts";

interface FileTreeProps {
  notes: GraftNote[];
  folders: { name: string; children: { id: string; title: string }[] }[];
  groupColors: Record<string, string>;
  activeId: string | null;
  onOpen: (id: string) => void;
  query: string;
}

export function FileTree({
  notes,
  folders,
  groupColors,
  activeId,
  onOpen,
  query,
}: FileTreeProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const byId = Object.fromEntries(notes.map((n) => [n.id, n]));
  const q = query.trim().toLowerCase();

  return (
    <div className="flex-1 overflow-y-auto px-2 py-1.5">
      {folders.map((folder) => {
        const items = folder.children
          .map((c) => byId[c.id])
          .filter(Boolean)
          .filter((n) => !q || n.title.toLowerCase().includes(q));
        if (q && items.length === 0) return null;
        const isOpen = !collapsed[folder.name] || !!q;

        return (
          <div key={folder.name} className="mb-0.5">
            <button
              className="flex items-center gap-1.5 w-full px-2 py-1.5 bg-transparent border-none cursor-pointer rounded-sm text-[13px] font-semibold text-text-secondary text-left hover:bg-bg-surface"
              onClick={() =>
                setCollapsed((c) => ({
                  ...c,
                  [folder.name]: !c[folder.name],
                }))
              }
            >
              <ChevronRight
                size={13}
                className={`text-text-tertiary transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
              />
              {isOpen ? (
                <FolderOpen size={15} className="text-text-secondary" />
              ) : (
                <Folder size={15} className="text-text-secondary" />
              )}
              <span>{folder.name}</span>
              <span className="ml-auto text-[11px] text-text-tertiary font-medium">
                {folder.children.length}
              </span>
            </button>
            {isOpen && (
              <div className="pl-3.5">
                {items.map((n) => (
                  <button
                    key={n.id}
                    className={`flex items-center gap-2 w-full px-2 py-1.5 bg-transparent border-none cursor-pointer rounded-sm text-[13px] text-text-secondary text-left hover:bg-bg-surface hover:text-text-primary ${
                      n.id === activeId
                        ? "bg-accent-subtle text-accent-text font-medium"
                        : ""
                    }`}
                    onClick={() => onOpen(n.id)}
                  >
                    <FileText
                      size={14}
                      className="text-text-tertiary shrink-0"
                    />
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {n.title}
                    </span>
                    <span
                      className="w-[7px] h-[7px] rounded-full shrink-0"
                      style={{
                        background: groupColors[n.group],
                        opacity: 0.3 + n.strength * 0.7,
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
