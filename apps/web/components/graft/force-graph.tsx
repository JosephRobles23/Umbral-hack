"use client";

import { useRef, useEffect, useState } from "react";
import type { GraftNote, GraftLink } from "@umbral/contracts";

interface SimNode extends GraftNote {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface ForceGraphProps {
  notes: GraftNote[];
  links: GraftLink[];
  groupColors: Record<string, string>;
  groupLabels: Record<string, string>;
  activeId: string | null;
  onOpen: (id: string) => void;
}

export function ForceGraph({
  notes,
  links,
  groupColors,
  groupLabels,
  activeId,
  onOpen,
}: ForceGraphProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<{ nodes: SimNode[]; alpha: number } | null>(null);
  const dimsRef = useRef({ w: 700, h: 520 });
  const dragRef = useRef<string | null>(null);
  const [dims, setDims] = useState({ w: 700, h: 520 });
  const [, forceRender] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  if (!simRef.current) {
    const cx = 350,
      cy = 260,
      R = 180;
    const nodes: SimNode[] = notes.map((n, i) => {
      const a = (i / notes.length) * Math.PI * 2;
      return {
        ...n,
        x: cx + Math.cos(a) * R + (Math.random() - 0.5) * 30,
        y: cy + Math.sin(a) * R + (Math.random() - 0.5) * 30,
        vx: 0,
        vy: 0,
      };
    });
    simRef.current = { nodes, alpha: 1 };
  }

  useEffect(() => {
    function measure() {
      if (wrapRef.current) {
        const r = wrapRef.current.getBoundingClientRect();
        setDims({ w: r.width, h: r.height });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  dimsRef.current = dims;

  useEffect(() => {
    let raf: number;
    const sim = simRef.current!;
    const idIndex = Object.fromEntries(
      sim.nodes.map((n, i) => [n.id, i]),
    );

    function tick() {
      const { w, h } = dimsRef.current;
      const cx = w / 2,
        cy = h / 2;
      const nodes = sim.nodes;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy || 0.01;
          const f = 2600 / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f,
            fy = (dy / d) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }

      const ideal = 116;
      links.forEach((l) => {
        const ai = idIndex[l.source],
          bi = idIndex[l.target];
        if (ai === undefined || bi === undefined) return;
        const a = nodes[ai],
          b = nodes[bi];
        const dx = b.x - a.x,
          dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - ideal) * 0.035;
        const fx = (dx / d) * f,
          fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      });

      nodes.forEach((n) => {
        n.vx += (cx - n.x) * 0.006;
        n.vy += (cy - n.y) * 0.006;
        if (dragRef.current === n.id) {
          n.vx = 0;
          n.vy = 0;
          return;
        }
        n.vx *= 0.86;
        n.vy *= 0.86;
        n.x += n.vx * sim.alpha;
        n.y += n.vy * sim.alpha;
        const pad = 30;
        n.x = Math.max(pad, Math.min(w - pad, n.x));
        n.y = Math.max(pad, Math.min(h - pad, n.y));
      });

      sim.alpha *= 0.992;
      if (sim.alpha < 0.04) sim.alpha = 0.04;
      forceRender((f) => f + 1);
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [links]);

  const sim = simRef.current!;
  const nodes = sim.nodes;
  const idIndex = Object.fromEntries(nodes.map((n, i) => [n.id, i]));

  function neighbors(id: string): Set<string> {
    const set = new Set([id]);
    links.forEach((l) => {
      if (l.source === id) set.add(l.target);
      if (l.target === id) set.add(l.source);
    });
    return set;
  }

  const hl = hover
    ? neighbors(hover)
    : activeId
      ? neighbors(activeId)
      : null;

  function startDrag(e: React.MouseEvent, n: SimNode) {
    dragRef.current = n.id;
    simRef.current!.alpha = 0.6;
    const move = (ev: MouseEvent) => {
      const r = wrapRef.current!.getBoundingClientRect();
      n.x = ev.clientX - r.left;
      n.y = ev.clientY - r.top;
      n.vx = 0;
      n.vy = 0;
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[radial-gradient(circle_at_50%_45%,var(--bg-surface)_0%,var(--bg-base)_70%)]"
      ref={wrapRef}
    >
      <svg width={dims.w} height={dims.h} className="block">
        {links.map((l, i) => {
          const ai = idIndex[l.source],
            bi = idIndex[l.target];
          if (ai === undefined || bi === undefined) return null;
          const a = nodes[ai],
            b = nodes[bi];
          const active = hl
            ? hl.has(l.source) && hl.has(l.target)
            : true;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? "var(--text-disabled)" : "var(--bg-elevated)"}
              strokeWidth={active ? 1.4 : 1}
              opacity={hl ? (active ? 0.9 : 0.25) : 0.55}
            />
          );
        })}
        {nodes.map((n) => {
          const r = 7 + n.strength * 11;
          const color = groupColors[n.group] ?? "#9B9590";
          const dim = hl && !hl.has(n.id);
          const isActive = n.id === activeId;
          const ringR = r + 4;
          const circ = 2 * Math.PI * ringR;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              style={{
                cursor: "pointer",
                opacity: dim ? 0.3 : 1,
                transition: "opacity 150ms",
              }}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onMouseDown={(e) => startDrag(e, n)}
              onClick={() => onOpen(n.id)}
            >
              <circle
                r={ringR}
                fill="none"
                stroke={color}
                strokeOpacity={0.28}
                strokeWidth={2.5}
              />
              <circle
                r={ringR}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={`${circ * n.strength} ${circ}`}
                transform="rotate(-90)"
              />
              <circle
                r={r}
                fill={color}
                fillOpacity={0.25 + n.strength * 0.6}
                stroke={color}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              {isActive && (
                <circle
                  r={ringR + 5}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                />
              )}
              <text
                y={ringR + 15}
                textAnchor="middle"
                className="font-body text-[11.5px] pointer-events-none select-none"
                style={{
                  fontWeight: isActive ? 600 : 500,
                  fill: dim ? "var(--text-tertiary)" : "var(--text-primary)",
                }}
              >
                {n.title}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/85 dark:bg-bg-card/85 backdrop-blur border border-bg-elevated rounded-[10px] px-3 py-2.5 flex flex-col gap-[7px] shadow-sm">
        {Object.keys(groupColors).map((k) => (
          <span
            key={k}
            className="inline-flex items-center gap-[7px] text-xs text-text-secondary"
          >
            <span
              className="w-[9px] h-[9px] rounded-full shrink-0"
              style={{ background: groupColors[k] }}
            />
            {groupLabels[k] ?? k}
          </span>
        ))}
      </div>

      {/* Hint */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 text-xs text-text-tertiary bg-white/80 dark:bg-bg-card/80 px-3 py-1.5 rounded-full border border-bg-elevated whitespace-nowrap">
        {nodes.length} conceptos · {links.length} enlaces · arrastra los nodos
        · clic para abrir
      </div>
    </div>
  );
}
