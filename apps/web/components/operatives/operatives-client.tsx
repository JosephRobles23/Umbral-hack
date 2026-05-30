"use client";

import { useState, useEffect } from "react";
import type { Ede } from "@umbral/contracts";
import { Hexagon } from "lucide-react";
import { FilterBar } from "./filter-bar";
import { EdeCard } from "./ede-card";

export function OperativesClient({ edes }: { edes: Ede[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = edes.filter((e) => {
    if (level !== "all" && e.cognitiveLevel !== level) return false;
    if (status !== "all" && e.status !== status) return false;
    if (debounced) {
      const hay = `${e.id} ${e.title} ${e.whatAndHow.decision}`.toLowerCase();
      if (!hay.includes(debounced.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        level={level}
        onLevelChange={setLevel}
        status={status}
        onStatusChange={setStatus}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-tertiary">
          <Hexagon size={48} className="mx-auto mb-4" />
          <h3 className="text-base font-semibold text-text-primary mb-1.5">
            No se encontraron operativos
          </h3>
          <p className="text-sm text-text-secondary m-0">
            Indexa EDEs vía POST /api/edes o ajusta los filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {filtered.map((ede, i) => (
            <EdeCard key={ede.id} ede={ede} delay={i * 50} />
          ))}
        </div>
      )}
    </>
  );
}
