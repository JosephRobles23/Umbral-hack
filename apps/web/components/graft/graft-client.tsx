"use client";

import { useState, useEffect } from "react";
import { Share2, FileText, X, Search, Database } from "lucide-react";
import type { GraftGraph } from "@umbral/contracts";
import { ForceGraph } from "./force-graph";
import { NoteView } from "./note-view";
import { FileTree } from "./file-tree";
import { Progress } from "@/components/ui";

export function GraftClient() {
  const [graph, setGraph] = useState<GraftGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/graft")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setGraph(data);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-base">
        <span className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !graph) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-base">
        <div className="text-center max-w-md px-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-subtle flex items-center justify-center mx-auto mb-6">
            <Database size={32} className="text-warning" />
          </div>
          <h1 className="font-display text-2xl font-medium tracking-[-0.02em] mb-2">
            Neo4j no conectado
          </h1>
          <p className="text-sm text-text-secondary mb-4">
            {error ?? "No se pudo cargar el grafo de conocimiento."}
          </p>
          <p className="text-xs text-text-tertiary">
            Ejecuta{" "}
            <code className="font-mono bg-bg-elevated px-1.5 py-0.5 rounded text-accent-text">
              docker compose up neo4j
            </code>{" "}
            y recarga la página.
          </p>
        </div>
      </div>
    );
  }

  const note = openId
    ? graph.notes.find((n) => n.id === openId) ?? null
    : null;

  const dominated = graph.notes.filter(
    (n) => n.status === "dominado",
  ).length;

  const folders = buildFolders(graph);

  return (
    <div className="flex h-screen animate-page-in">
      {/* Explorer */}
      <aside className="w-[248px] shrink-0 h-screen bg-bg-sidebar border-r border-bg-elevated flex flex-col">
        <div className="flex items-center justify-between px-4 pt-[18px] pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-accent" />
            <span className="text-sm font-semibold">Bóveda</span>
          </div>
          <span className="text-xs text-text-tertiary">
            {graph.notes.length} notas
          </span>
        </div>

        <div className="flex items-center gap-2 mx-3 mb-2 px-2.5 py-[7px] bg-bg-card border border-bg-muted rounded-md">
          <Search size={14} className="text-text-tertiary shrink-0" />
          <input
            placeholder="Buscar nota…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-none outline-none bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        <FileTree
          notes={graph.notes}
          folders={folders}
          groupColors={graph.groupColors}
          activeId={openId}
          onOpen={setOpenId}
          query={query}
        />

        <div className="shrink-0 px-4 pt-3.5 pb-[18px] border-t border-bg-elevated">
          <div className="text-xs text-text-tertiary mb-1.5">
            Progreso de dominio
          </div>
          <Progress value={dominated} max={graph.notes.length} />
          <div className="text-xs text-text-tertiary mt-1.5">
            {dominated} de {graph.notes.length} conceptos dominados
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="flex-1 min-w-0 flex flex-col h-screen">
        {/* Toolbar */}
        <div className="flex items-end gap-1 h-12 shrink-0 px-4 border-b border-bg-elevated bg-bg-base">
          <button
            className={`inline-flex items-center gap-2 h-9 px-3.5 bg-transparent border border-transparent cursor-pointer rounded-t-lg text-[13px] font-medium -mb-px ${
              !openId
                ? "bg-bg-card border-bg-elevated border-b-transparent text-text-primary"
                : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
            }`}
            onClick={() => setOpenId(null)}
          >
            <Share2 size={15} /> Grafo
          </button>
          {note && (
            <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-bg-card border border-bg-elevated border-b-transparent cursor-pointer rounded-t-lg text-[13px] font-medium text-text-primary -mb-px">
              <FileText size={15} /> {note.title}
              <span
                className="inline-flex rounded p-0.5 text-text-tertiary hover:bg-bg-elevated hover:text-text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId(null);
                }}
              >
                <X size={12} />
              </span>
            </button>
          )}
        </div>

        {/* Stage */}
        <div className="flex-1 min-h-0 overflow-hidden bg-bg-base">
          {note ? (
            <NoteView
              note={note}
              allNotes={graph.notes}
              groupColors={graph.groupColors}
              groupLabels={graph.groupLabels}
              onOpen={setOpenId}
            />
          ) : (
            <ForceGraph
              notes={graph.notes}
              links={graph.links}
              groupColors={graph.groupColors}
              groupLabels={graph.groupLabels}
              activeId={openId}
              onOpen={setOpenId}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function buildFolders(graph: GraftGraph) {
  const map = new Map<string, { id: string; title: string }[]>();
  for (const n of graph.notes) {
    const folder = n.folder || "Sin carpeta";
    if (!map.has(folder)) map.set(folder, []);
    map.get(folder)!.push({ id: n.id, title: n.title });
  }
  return Array.from(map.entries()).map(([name, children]) => ({
    name,
    children,
  }));
}
