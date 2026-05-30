/* ============================================================
   UMBRAL — Operativos (grid + detalle)
   ============================================================ */
function EDECard({ ede, navigate, delay }) {
  return (
    <button className="ede-card stagger-in" style={{ borderLeftColor: LEVEL_VAR[ede.level], animationDelay: delay + "ms" }}
      onClick={() => navigate("operative", { edeId: ede.id })}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ComplexityBadge level={ede.level} tier={ede.tier} />
        <div style={{ minWidth: 0 }}>
          <div className="overline" style={{ color: LEVEL_VAR[ede.level] }}>{LEVEL_LABEL[ede.level]}</div>
          <div className="heading-md" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ede.title}</div>
          <div className="mono-sm text-tertiary">{ede.id}</div>
        </div>
      </div>
      <p className="body-md text-secondary" style={{ margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        “{ede.decision}”
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <StatusBadge status={ede.status} />
        <span className="badge badge-version">v{ede.version}</span>
      </div>
    </button>
  );
}

const LEVEL_FILTER = [
  { value: "all", label: "Todos los niveles" },
  { value: "explorer", label: "Explorer" },
  { value: "navigator", label: "Navigator" },
  { value: "anchor", label: "Anchor" },
];
const STATUS_FILTER = [
  { value: "all", label: "Todos los estados" },
  { value: "accepted", label: "Aceptado" },
  { value: "proposed", label: "Propuesto" },
  { value: "deprecated", label: "Obsoleto" },
];

function OperativesPage({ navigate }) {
  const all = window.UMBRAL_DATA.edes;
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [debounced, setDebounced] = useState("");
  useEffect(() => { const t = setTimeout(() => setDebounced(q), 200); return () => clearTimeout(t); }, [q]);

  const filtered = all.filter(e => {
    if (level !== "all" && e.level !== level) return false;
    if (status !== "all" && e.status !== status) return false;
    if (debounced) {
      const hay = (e.id + " " + e.title + " " + e.decision + " " + e.topic).toLowerCase();
      if (!hay.includes(debounced.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="page-fade">
      <PageHead title="Operativos" sub="Decisiones de Estructura Explícita (EDE)" />
      <div className="filter-bar">
        <div className="search-wrap">
          <Icon name="search" size={16} style={{ color: "var(--text-tertiary)" }} />
          <input placeholder="Buscar EDEs…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div style={{ width: 180 }}><Select value={level} options={LEVEL_FILTER} onChange={setLevel} /></div>
        <div style={{ width: 180 }}><Select value={status} options={STATUS_FILTER} onChange={setStatus} /></div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-tertiary)" }}>
          <Icon name="hexagon" size={48} />
          <h3 className="heading-md" style={{ margin: "16px 0 6px", color: "var(--text-primary)" }}>No se encontraron operativos</h3>
          <p className="body-md text-secondary" style={{ margin: 0 }}>Indexa EDEs vía POST /api/edes o ajusta los filtros.</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((e, i) => <EDECard key={e.id} ede={e} navigate={navigate} delay={i * 50} />)}
        </div>
      )}
    </div>
  );
}

/* ---------------- Detalle ---------------- */
function InfoCard({ children }) {
  return <div className="card card-pad" style={{ padding: 20 }}>{children}</div>;
}
function FieldRow({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="label-sm text-tertiary" style={{ marginBottom: 4 }}>{label}</div>
      <div className="body-md" style={{ color: "var(--text-primary)" }}>{children}</div>
    </div>
  );
}

function DecisionTab({ ede }) {
  return (
    <div>
      <div className="section-block">
        <h3 className="heading-md">Qué y cómo</h3>
        <InfoCard>
          <FieldRow label="Decisión">{ede.decision}</FieldRow>
          <FieldRow label="Mecanismo">{ede.mechanism}</FieldRow>
        </InfoCard>
      </div>
      <div className="section-block">
        <h3 className="heading-md">Por qué</h3>
        <InfoCard>
          <FieldRow label="Justificación">{ede.rationale}</FieldRow>
          <FieldRow label="Alternativas consideradas">{ede.alternatives}</FieldRow>
          <div>
            <div className="label-sm text-tertiary" style={{ marginBottom: 6 }}>Referencias</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ede.references.map((r, i) => <span key={i} className="badge badge-neutral">{r}</span>)}
            </div>
          </div>
        </InfoCard>
      </div>
      <div className="section-block">
        <h3 className="heading-md">Anti-patrones <span className="text-tertiary" style={{ fontWeight: 400, fontSize: 13 }}>(PROHIBIDO)</span></h3>
        <div className="list-card" style={{ background: "var(--error-subtle)", borderColor: "var(--error)" }}>
          {ede.antiPatterns.map((ap, i) => (
            <div key={i} className="list-row" style={{ borderBottomColor: "rgba(193,58,49,0.18)" }}>
              <span style={{ color: "var(--error)", display: "inline-flex", flexShrink: 0, marginTop: 1 }}><Icon name="x" size={16} /></span>
              <span className="body-md" style={{ color: "var(--text-primary)" }}>{ap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContractsTab({ ede }) {
  return (
    <div>
      <div className="section-block">
        <h3 className="heading-md">Contratos entre capas</h3>
        <div className="list-card">
          {ede.contracts.map((c, i) => (
            <div key={i} className="list-row" style={{ alignItems: "center" }}>
              <span className="mono-sm" style={{ background: "var(--bg-base)", border: "1px solid var(--bg-elevated)", borderRadius: 6, padding: "3px 8px", flexShrink: 0 }}>{c.from} → {c.to}</span>
              <span className="body-md text-secondary">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="section-block">
        <h3 className="heading-md">Verificado por</h3>
        <InfoCard>
          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {ede.verifiedBy.map((v, i) => <li key={i} className="body-md text-secondary">{v}</li>)}
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}

function TestsTab({ ede }) {
  const t = ede.tests;
  return (
    <div>
      <div className="section-block" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h3 className="heading-md">Pruebas unitarias</h3>
          <div className="list-card">
            {t.unit.map((u, i) => (
              <div key={i} className="list-row" style={{ alignItems: "center" }}>
                <span style={{ color: "var(--success)", display: "inline-flex", flexShrink: 0 }}><Icon name="check-circle" size={16} /></span>
                <span className="body-md">{u}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="heading-md">Caminos tristes</h3>
          <div className="list-card">
            {t.sadPaths.map((u, i) => (
              <div key={i} className="list-row" style={{ alignItems: "center" }}>
                <span style={{ color: "var(--warning)", display: "inline-flex", flexShrink: 0 }}><Icon name="alert-triangle" size={16} /></span>
                <span className="body-md">{u}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-block">
        <h3 className="heading-md">Cobertura objetivo</h3>
        <InfoCard>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="body-md text-secondary">Cobertura actual</span>
            <span className="mono-sm" style={{ color: colorForPct(t.coverageCurrent) }}>{t.coverageCurrent}% / objetivo {t.coverageTarget}%</span>
          </div>
          <Progress value={t.coverageCurrent} max={100} />
        </InfoCard>
      </div>
    </div>
  );
}

function HistoryTab({ ede }) {
  const p = ede.provenance;
  return (
    <div className="section-block">
      <h3 className="heading-md">Procedencia</h3>
      <InfoCard>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FieldRow label="Fase">{p.phase}</FieldRow>
          <FieldRow label="Slice"><span className="mono-sm">{p.slice}</span></FieldRow>
          <FieldRow label="Creado por"><span className="mono-sm">{p.createdBy}</span></FieldRow>
          <FieldRow label="Versión actual">v{ede.version}</FieldRow>
          <FieldRow label="Fecha de creación">{p.createdAt}</FieldRow>
          <FieldRow label="Última actualización">{p.updatedAt}</FieldRow>
        </div>
      </InfoCard>
    </div>
  );
}

const DETAIL_TABS = [
  { id: "decision", label: "Decisión" },
  { id: "contracts", label: "Contratos" },
  { id: "tests", label: "Pruebas" },
  { id: "history", label: "Historial" },
];

function OperativeDetailPage({ route, navigate }) {
  const ede = window.UMBRAL_DATA.edes.find(e => e.id === route.params.edeId) || window.UMBRAL_DATA.edes[0];
  const [tab, setTab] = useState("decision");
  useEffect(() => { setTab("decision"); }, [ede.id]);

  return (
    <div className="page-fade">
      <button className="btn-ghost" style={{ marginBottom: 16, paddingLeft: 8 }} onClick={() => navigate("operatives")}>
        <Icon name="arrow-left" size={14} /> Volver a Operativos
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <ComplexityBadge level={ede.level} tier={ede.tier} size={48} />
        <div style={{ flex: 1 }}>
          <div className="overline" style={{ color: LEVEL_VAR[ede.level] }}>{LEVEL_LABEL[ede.level]} · {ede.topic}</div>
          <h1 className="display-md" style={{ margin: "2px 0 6px" }}>{ede.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="mono-sm text-tertiary">{ede.id}</span>
            <StatusBadge status={ede.status} />
            <span className="badge badge-version">v{ede.version}</span>
          </div>
        </div>
      </div>

      <div className="tabbar">
        {DETAIL_TABS.map(t => (
          <button key={t.id} className={`tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div key={tab} className="page-fade">
        {tab === "decision" && <DecisionTab ede={ede} />}
        {tab === "contracts" && <ContractsTab ede={ede} />}
        {tab === "tests" && <TestsTab ede={ede} />}
        {tab === "history" && <HistoryTab ede={ede} />}
      </div>
    </div>
  );
}

Object.assign(window, { OperativesPage, OperativeDetailPage });
