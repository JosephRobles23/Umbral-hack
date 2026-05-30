/* ============================================================
   UMBRAL — Graft: grafo de conocimiento estilo Obsidian
   ============================================================ */

/* ---- util: links únicos del grafo ---- */
function buildGraph() {
  const G = window.UMBRAL_GRAFT;
  const notes = G.notes;
  const byId = Object.fromEntries(notes.map(n => [n.id, n]));
  const seen = new Set();
  const links = [];
  notes.forEach(n => (n.links || []).forEach(t => {
    if (!byId[t]) return;
    const key = [n.id, t].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ source: n.id, target: t });
  }));
  return { notes, byId, links };
}
function titleToId(title) {
  const G = window.UMBRAL_GRAFT;
  const t = title.trim().toLowerCase();
  const n = G.notes.find(x => x.title.toLowerCase() === t);
  return n ? n.id : null;
}

/* ---- Markdown viewer ---- */
function NoteView({ note, onOpen, onShowGraph }) {
  const ref = useRef(null);
  const G = window.UMBRAL_GRAFT;
  useEffect(() => {
    if (!ref.current || !window.marked) return;
    // pre-procesa wikilinks [[Título]] -> anchor
    const md = note.md.replace(/\[\[([^\]]+)\]\]/g, (m, t) => `<a class="wikilink" data-title="${t}">${t}</a>`);
    ref.current.innerHTML = window.marked.parse(md);
    // refuerza enlaces internos
    ref.current.querySelectorAll("a.wikilink").forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const id = titleToId(a.dataset.title);
        if (id) onOpen(id);
      });
    });
  }, [note.id]);

  const backlinks = G.notes.filter(n => (n.links || []).includes(note.id) && n.id !== note.id);
  const outgoing = (note.links || []).map(id => G.notes.find(x => x.id === id)).filter(Boolean);
  const color = G.groupColors[note.group];

  return (
    <div className="graft-note">
      <div className="graft-note-head">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="graft-note-dot" style={{ background: color }} />
          <div>
            <div className="caption" style={{ textTransform: "uppercase", letterSpacing: "0.05em", color }}>{G.groupLabels[note.group]}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`badge graft-status-badge status-${note.status}`}>{G.statusLabels[note.status]}</span>
          <span className="caption mono-xs">solidez {Math.round(note.strength * 100)}%</span>
        </div>
      </div>
      <div className="graft-md" ref={ref} />

      <div className="graft-links-section">
        <div className="graft-links-col">
          <div className="overline" style={{ marginBottom: 10, color: "var(--text-tertiary)" }}>
            <Icon name="link" size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />Enlaces salientes ({outgoing.length})
          </div>
          {outgoing.length === 0 ? <span className="caption">Ninguno</span> : outgoing.map(n => (
            <button key={n.id} className="graft-link-pill" onClick={() => onOpen(n.id)}>
              <span className="graft-pill-dot" style={{ background: G.groupColors[n.group] }} />{n.title}
            </button>
          ))}
        </div>
        <div className="graft-links-col">
          <div className="overline" style={{ marginBottom: 10, color: "var(--text-tertiary)" }}>
            <Icon name="git-merge" size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} />Backlinks ({backlinks.length})
          </div>
          {backlinks.length === 0 ? <span className="caption">Ninguno</span> : backlinks.map(n => (
            <button key={n.id} className="graft-link-pill" onClick={() => onOpen(n.id)}>
              <span className="graft-pill-dot" style={{ background: G.groupColors[n.group] }} />{n.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Grafo de fuerzas ---- */
function ForceGraph({ activeId, onOpen }) {
  const { notes, links } = buildGraph();
  const G = window.UMBRAL_GRAFT;
  const wrapRef = useRef(null);
  const simRef = useRef(null);
  const [dims, setDims] = useState({ w: 700, h: 520 });
  const [, force] = useState(0);          // re-render trigger
  const [hover, setHover] = useState(null);
  const dragRef = useRef(null);

  // init nodes una sola vez
  if (!simRef.current) {
    const cx = 350, cy = 260, R = 180;
    const nodes = notes.map((n, i) => {
      const a = (i / notes.length) * Math.PI * 2;
      return { ...n, x: cx + Math.cos(a) * R + (Math.random() - 0.5) * 30, y: cy + Math.sin(a) * R + (Math.random() - 0.5) * 30, vx: 0, vy: 0 };
    });
    simRef.current = { nodes, alpha: 1 };
  }

  // medir contenedor
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

  // simulación
  useEffect(() => {
    let raf;
    const sim = simRef.current;
    const idIndex = Object.fromEntries(sim.nodes.map((n, i) => [n.id, i]));
    function tick() {
      const { w, h } = dimsRef.current;
      const cx = w / 2, cy = h / 2;
      const nodes = sim.nodes;
      // carga (repulsión)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy || 0.01;
          const f = 2600 / d2;
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
      }
      // resortes (links)
      const ideal = 116;
      links.forEach(l => {
        const a = nodes[idIndex[l.source]], b = nodes[idIndex[l.target]];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - ideal) * 0.035;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      });
      // centrado + integración
      nodes.forEach(n => {
        n.vx += (cx - n.x) * 0.006;
        n.vy += (cy - n.y) * 0.006;
        if (dragRef.current === n.id) { n.vx = 0; n.vy = 0; return; }
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx * sim.alpha; n.y += n.vy * sim.alpha;
        const pad = 30;
        n.x = Math.max(pad, Math.min(w - pad, n.x));
        n.y = Math.max(pad, Math.min(h - pad, n.y));
      });
      sim.alpha *= 0.992;
      if (sim.alpha < 0.04) sim.alpha = 0.04;
      force(f => f + 1);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // dims ref para el loop
  const dimsRef = useRef(dims);
  dimsRef.current = dims;

  const sim = simRef.current;
  const nodes = sim.nodes;
  const idIndex = Object.fromEntries(nodes.map((n, i) => [n.id, i]));

  const neighbors = (id) => {
    const set = new Set([id]);
    links.forEach(l => { if (l.source === id) set.add(l.target); if (l.target === id) set.add(l.source); });
    return set;
  };
  const hl = hover ? neighbors(hover) : (activeId ? neighbors(activeId) : null);

  // drag handlers
  function startDrag(e, n) {
    dragRef.current = n.id;
    simRef.current.alpha = 0.6;
    const move = ev => {
      const r = wrapRef.current.getBoundingClientRect();
      const cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      const cy = (ev.touches ? ev.touches[0].clientY : ev.clientY) - r.top;
      n.x = cx; n.y = cy; n.vx = 0; n.vy = 0;
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
    <div className="graft-graph" ref={wrapRef}>
      <svg width={dims.w} height={dims.h} className="graft-svg">
        {links.map((l, i) => {
          const a = nodes[idIndex[l.source]], b = nodes[idIndex[l.target]];
          const active = hl ? (hl.has(l.source) && hl.has(l.target)) : true;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={active ? "var(--text-disabled)" : "var(--bg-elevated)"}
            strokeWidth={active ? 1.4 : 1} opacity={hl ? (active ? 0.9 : 0.25) : 0.55} />;
        })}
        {nodes.map(n => {
          const r = 7 + n.strength * 11;
          const color = G.groupColors[n.group];
          const dim = hl && !hl.has(n.id);
          const isActive = n.id === activeId;
          const ringR = r + 4;
          const circ = 2 * Math.PI * ringR;
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} style={{ cursor: "pointer", opacity: dim ? 0.3 : 1, transition: "opacity 150ms" }}
              onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}
              onMouseDown={e => startDrag(e, n)} onClick={() => onOpen(n.id)}>
              {/* anillo de solidez */}
              <circle r={ringR} fill="none" stroke={color} strokeOpacity="0.28" strokeWidth="2.5" />
              <circle r={ringR} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${circ * n.strength} ${circ}`} transform="rotate(-90)" />
              {/* núcleo */}
              <circle r={r} fill={color} fillOpacity={0.25 + n.strength * 0.6} stroke={color} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && <circle r={ringR + 5} fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />}
              <text y={ringR + 15} textAnchor="middle" className="graft-node-label"
                style={{ fontWeight: isActive ? 600 : 500, fill: dim ? "var(--text-tertiary)" : "var(--text-primary)" }}>{n.title}</text>
            </g>
          );
        })}
      </svg>

      <div className="graft-legend">
        {Object.keys(G.groupColors).map(k => (
          <span key={k} className="graft-legend-item"><span className="graft-pill-dot" style={{ background: G.groupColors[k] }} />{G.groupLabels[k]}</span>
        ))}
      </div>
      <div className="graft-graph-hint">{nodes.length} conceptos · {links.length} enlaces · arrastra los nodos · clic para abrir</div>
    </div>
  );
}

/* ---- Explorador de archivos ---- */
function FileTree({ activeId, onOpen, query }) {
  const G = window.UMBRAL_GRAFT;
  const [collapsed, setCollapsed] = useState({});
  const byId = Object.fromEntries(G.notes.map(n => [n.id, n]));
  const q = query.trim().toLowerCase();

  return (
    <div className="graft-tree">
      {G.tree.map(folder => {
        const items = folder.children.map(c => byId[c.id]).filter(Boolean)
          .filter(n => !q || n.title.toLowerCase().includes(q));
        if (q && items.length === 0) return null;
        const isOpen = !collapsed[folder.name] || q;
        return (
          <div key={folder.name} className="graft-folder">
            <button className="graft-folder-head" onClick={() => setCollapsed(c => ({ ...c, [folder.name]: !c[folder.name] }))}>
              <Icon name="chevron-right" size={13} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 150ms", color: "var(--text-tertiary)" }} />
              <Icon name={isOpen ? "folder-open" : "folder"} size={15} style={{ color: "var(--text-secondary)" }} />
              <span>{folder.name}</span>
              <span className="graft-folder-count">{folder.children.length}</span>
            </button>
            {isOpen && (
              <div className="graft-folder-items">
                {items.map(n => (
                  <button key={n.id} className={`graft-file${n.id === activeId ? " active" : ""}`} onClick={() => onOpen(n.id)}>
                    <Icon name="file-text" size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                    <span className="graft-file-name">{n.title}</span>
                    <span className="graft-file-dot" style={{ background: G.groupColors[n.group], opacity: 0.3 + n.strength * 0.7 }} />
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

/* ---- Página Graft ---- */
function GraftPage() {
  const G = window.UMBRAL_GRAFT;
  const [openId, setOpenId] = useState(null);   // null => grafo
  const [query, setQuery] = useState("");
  const note = openId ? G.notes.find(n => n.id === openId) : null;
  const dominated = G.notes.filter(n => n.status === "dominado").length;

  function open(id) { setOpenId(id); }

  return (
    <div className="graft-page page-fade">
      {/* Explorador */}
      <aside className="graft-explorer">
        <div className="graft-explorer-head">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="share-2" size={16} style={{ color: "var(--accent)" }} />
            <span className="heading-sm">Bóveda</span>
          </div>
          <span className="caption">{G.notes.length} notas</span>
        </div>
        <div className="graft-search">
          <Icon name="search" size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
          <input placeholder="Buscar nota…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <FileTree activeId={openId} onOpen={open} query={query} />
        <div className="graft-explorer-foot">
          <div className="caption" style={{ marginBottom: 6 }}>Progreso de dominio</div>
          <div className="progress" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: (dominated / G.notes.length * 100) + "%", background: "var(--success)" }} />
          </div>
          <div className="caption" style={{ marginTop: 6 }}>{dominated} de {G.notes.length} conceptos dominados</div>
        </div>
      </aside>

      {/* Principal */}
      <section className="graft-main">
        <div className="graft-toolbar">
          <button className={`graft-tab${!openId ? " active" : ""}`} onClick={() => setOpenId(null)}>
            <Icon name="share-2" size={15} /> Grafo
          </button>
          {note && (
            <button className="graft-tab active">
              <Icon name="file-text" size={15} /> {note.title}
              <span className="graft-tab-close" onClick={e => { e.stopPropagation(); setOpenId(null); }}><Icon name="x" size={12} /></span>
            </button>
          )}
        </div>
        <div className="graft-stage">
          {note ? <NoteView note={note} onOpen={open} onShowGraph={() => setOpenId(null)} /> : <ForceGraph activeId={openId} onOpen={open} />}
        </div>
      </section>
    </div>
  );
}

window.GraftPage = GraftPage;
