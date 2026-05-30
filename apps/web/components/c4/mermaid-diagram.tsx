"use client";

import { useRef, useEffect, useState } from "react";

export function MermaidDiagram({ def }: { def: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!ref.current) return;
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            fontFamily: "Inter, IBM Plex Sans, sans-serif",
            fontSize: "13px",
            primaryColor: "#E8EAFC",
            primaryBorderColor: "#6366F1",
            lineColor: "#9B9590",
            textColor: "#1A1A1A",
          },
        });

        const id = "mmd-" + Math.random().toString(36).slice(2, 9);
        const { svg } = await mermaid.render(id, def);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [def]);

  if (error) {
    return (
      <div className="p-10 text-center text-text-tertiary text-[13px]">
        No se pudo renderizar el diagrama.
        <br />
        <span className="font-mono text-[11px]">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="w-full [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:block [&_svg]:mx-auto [&_.cluster_rect]:rx-[10px] [&_.cluster_rect]:ry-[10px]"
      aria-label="Diagrama de arquitectura"
    />
  );
}
