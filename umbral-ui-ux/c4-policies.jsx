/* ============================================================
   UMBRAL — Modelo C4 (diagramas Mermaid) y Políticas
   ============================================================ */

/* ---- Definiciones de diagramas ---- */
const C4_CLASSDEFS = `
  classDef ext fill:#EDE8DD,stroke:#9B9590,stroke-width:1.5px,color:#1A1A1A;
  classDef system fill:#E8EAFC,stroke:#6366F1,stroke-width:1.5px,color:#312E81;
  classDef container fill:#E0F2FE,stroke:#0EA5E9,stroke-width:1.5px,color:#075985;
  classDef component fill:#E7F8F1,stroke:#10B981,stroke-width:1.5px,color:#065F46;
  classDef code fill:#F5E6DE,stroke:#DA7756,stroke-width:1.5px,color:#9A4A2C;
  classDef db fill:#2C2B26,stroke:#1A1915,stroke-width:1.5px,color:#F5F0E8;
`;

const C4_DIAGRAMS = {
  capas: {
    label: "Vista por capas",
    desc: "Las cuatro capas del modelo C4 y cómo se conectan, de la interfaz al código.",
    def: `flowchart TB
  usuario(["Usuario"]):::ext
  subgraph L5["L5 · Sistema"]
    direction LR
    frontend["frontend<br/><small>React 19</small>"]:::system
    api["api<br/><small>Next.js</small>"]:::system
  end
  subgraph L4["L4 · Contenedores"]
    direction LR
    bff["bff"]:::container
    worker["worker"]:::container
    sseHub["sse-hub"]:::container
  end
  subgraph L23["L2 / L3 · Componentes"]
    direction LR
    motor["motor-políticas"]:::component
    regen["regenerador-c4"]:::component
    indice["índice-fts"]:::component
    auth["auth"]:::component
  end
  subgraph L1["L1 · Código"]
    direction LR
    repo["repositorio"]:::code
    migr["migraciones"]:::code
    dsl["dsl-políticas"]:::code
  end
  db[("SQLite")]:::db
  usuario --> frontend
  frontend --> api
  api --> bff
  bff --> motor
  bff --> indice
  motor --> auth
  regen --> sseHub
  sseHub --> frontend
  worker --> repo
  motor --> repo
  indice --> repo
  auth --> repo
  migr --> repo
  repo --> db
  ${C4_CLASSDEFS}`,
  },
  datos: {
    label: "Flujo de datos",
    desc: "Recorrido de una petición del usuario hasta la base de datos y de vuelta.",
    def: `flowchart LR
  usuario(["Usuario"]):::ext --> frontend["frontend"]:::system
  frontend -->|"petición HTTP"| api["api"]:::system
  api --> bff["bff"]:::container
  bff -->|"evalúa reglas"| motor["motor-políticas"]:::component
  bff -->|"consulta"| indice["índice-fts"]:::component
  motor --> repo["repositorio"]:::code
  indice --> repo
  repo -->|"SQL tipado"| db[("SQLite")]:::db
  ${C4_CLASSDEFS}`,
  },
  eventos: {
    label: "Flujo de eventos",
    desc: "Cómo un cambio en un EDE regenera la documentación y llega al cliente vía SSE.",
    def: `flowchart LR
  ede["EDE actualizado"]:::component --> regen["regenerador-c4"]:::component
  regen -->|"reconstruye grafo"| sseHub["sse-hub"]:::container
  sseHub -->|"evento SSE"| frontend["frontend"]:::system
  frontend -->|"actualiza UI"| usuario(["Usuario"]):::ext
  worker["worker · cola"]:::container -.->|"encola job"| regen
  ${C4_CLASSDEFS}`,
  },
};

/* ---- Componente Mermaid ---- */
function Mermaid({ def }) {
  const ref = useRef(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!window.mermaid || !ref.current) { setErr("Mermaid no disponible"); return; }
      try {
        const id = "mmd-" + Math.random().toString(36).slice(2, 9);
        const { svg } = await window.mermaid.render(id, def);
        if (!cancelled && ref.current) { ref.current.innerHTML = svg; setErr(null); }
      } catch (e) {
        if (!cancelled) setErr(String(e && e.message ? e.message : e));
      }
    }
    render();
    return () => { cancelled = true; };
  }, [def]);
  if (err) return <div className="mermaid-err">No se pudo renderizar el diagrama.<br /><span className="mono-xs">{err}</span></div>;
  return <div className="mermaid-host" ref={ref} aria-label="Diagrama de arquitectura" />;
}

const C4_LEGEND = [
  { label: "Sistema (L5)", color: "#6366F1" },
  { label: "Contenedor (L4)", color: "#0EA5E9" },
  { label: "Componente (L2/L3)", color: "#10B981" },
  { label: "Código (L1)", color: "#DA7756" },
];

function C4Page() {
  const keys = Object.keys(C4_DIAGRAMS);
  const [view, setView] = useState("capas");
  const [updated, setUpdated] = useState("hace 2 minutos");
  const [nonce, setNonce] = useState(0);
  const current = C4_DIAGRAMS[view];

  function regen() {
    setUpdated("hace unos segundos");
    setNonce(n => n + 1);   // fuerza un re-render del diagrama
  }

  return (
    <div className="page-fade">
      <PageHead title="Arquitectura C4" sub="Generada automáticamente desde los EDEs"
        right={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StatusDot variant="success" label="SSE conectado" />
          <Button variant="secondary" onClick={regen} icon={<Icon name="refresh-cw" size={16} />}>Regenerar</Button>
        </div>} />

      <div className="tabbar">
        {keys.map(k => (
          <button key={k} className={`tab${view === k ? " active" : ""}`} onClick={() => setView(k)}>{C4_DIAGRAMS[k].label}</button>
        ))}
      </div>

      <p className="body-md text-secondary" style={{ margin: "0 0 16px" }}>{current.desc}</p>

      <div className="card mermaid-card">
        <div className="mermaid-legend">
          {C4_LEGEND.map(l => (
            <span key={l.label} className="mermaid-legend-item">
              <span className="mermaid-swatch" style={{ background: l.color }} />{l.label}
            </span>
          ))}
        </div>
        <div className="mermaid-canvas">
          <Mermaid key={view + "-" + nonce} def={current.def} />
        </div>
      </div>

      <div className="caption" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="sparkles" size={13} /> Diagrama derivado de los operativos · última actualización: {updated}
      </div>
    </div>
  );
}

/* ---------------- Políticas ---------------- */
const POLICY_GROUPS = [
  { key: "allow", title: "PERMITIR", icon: "check-circle", color: "var(--success)", bg: "var(--success-subtle)", glyph: "●" },
  { key: "deny", title: "DENEGAR", icon: "x-circle", color: "var(--error)", bg: "var(--error-subtle)", glyph: "✕" },
  { key: "require_approval", title: "REQUIERE APROBACIÓN", icon: "ban", color: "var(--warning)", bg: "var(--warning-subtle)", glyph: "⊘" },
];

function PoliciesPage({ navigate }) {
  const P = window.UMBRAL_POLICIES;
  const total = P.allow.length + P.deny.length + P.require_approval.length;
  const sourceCount = new Set([...P.allow, ...P.deny, ...P.require_approval].map(p => p.source)).size;

  return (
    <div className="page-fade">
      <PageHead title="Políticas" sub="Políticas de gobernanza activas derivadas de los EDEs" />
      <div className="card card-pad" style={{ padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "var(--accent)", display: "inline-flex" }}><Icon name="shield-check" size={18} /></span>
        <span className="body-md"><strong>{total} políticas activas</strong> derivadas de {sourceCount} EDEs</span>
      </div>

      {POLICY_GROUPS.map(g => (
        <div key={g.key} className="card" style={{ marginBottom: 16, overflow: "hidden" }}>
          <div style={{ background: g.bg, padding: "12px 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: g.color, display: "inline-flex" }}><Icon name={g.icon} size={16} /></span>
            <span className="heading-sm" style={{ color: g.color, letterSpacing: "0.04em" }}>{g.title}</span>
            <span className="badge badge-neutral" style={{ marginLeft: "auto" }}>{P[g.key].length}</span>
          </div>
          <div>
            {P[g.key].map((p, i) => (
              <div key={i} className="list-row" style={{ alignItems: "center", padding: "12px 20px" }}>
                <span style={{ color: g.color, width: 18, flexShrink: 0, textAlign: "center" }}>{g.glyph}</span>
                <span className="body-md" style={{ flex: 1, color: "var(--text-primary)" }}>{p.text}</span>
                <button className="mono-xs" style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                  onClick={() => navigate("operative", { edeId: p.source })}>
                  {p.source} <Icon name="external-link" size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { C4Page, PoliciesPage });
