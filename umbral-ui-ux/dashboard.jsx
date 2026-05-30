/* ============================================================
   UMBRAL — Dashboard
   ============================================================ */
function MetricCard({ label, value, mono, trend, trendDir, progress, progressColor }) {
  return (
    <div className="metric-card">
      <div className="label-sm text-secondary" style={{ marginBottom: 10 }}>{label}</div>
      <div className="display-md" style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-display)" }}>{value}</div>
      {trend && (
        <div className="caption" style={{ marginTop: 6, color: trendDir === "good" ? "var(--success)" : "var(--warning)", display: "flex", alignItems: "center", gap: 4 }}>
          <span>{trendDir === "good" ? "▼" : "▲"}</span>{trend}
        </div>
      )}
      {progress != null && (
        <div style={{ marginTop: 14 }}>
          <div className="progress" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: progress + "%", background: progressColor || "var(--accent)" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function CompactC4({ navigate }) {
  const c4 = window.UMBRAL_DATA.c4;
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 className="heading-lg" style={{ margin: 0 }}>Arquitectura C4</h2>
        <StatusDot variant="success" label="SSE conectado" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {c4.map(layer => (
          <div key={layer.layer} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderLeft: `3px solid ${layer.color}`, paddingLeft: 14 }}>
            <span className="overline" style={{ color: layer.color, width: 120, flexShrink: 0 }}>{layer.label}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {layer.elements.map(el => (
                <span key={el.name} className="mono-xs" style={{ background: "var(--bg-base)", border: "1px solid var(--bg-elevated)", borderRadius: 6, padding: "3px 9px", color: "var(--text-secondary)" }}>{el.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-ghost" style={{ marginTop: 14 }} onClick={() => navigate("c4")}>
        Ver modelo completo <Icon name="arrow-left" size={14} style={{ transform: "rotate(180deg)" }} />
      </button>
    </div>
  );
}

const ACT_ICON = { ede: "hexagon", grill: "flame", terminal: "square-terminal", c4: "layers" };
function RecentActivity({ navigate }) {
  const acts = window.UMBRAL_DATA.activity;
  return (
    <div className="list-card">
      {acts.map((a, i) => (
        <button key={i} className="list-row" style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", borderBottom: i < acts.length - 1 ? "1px solid var(--bg-elevated)" : "none", cursor: "pointer", alignItems: "center" }}
          onClick={() => { if (a.target.startsWith("EDE")) navigate("operative", { edeId: a.target }); else navigate(a.target); }}>
          <span style={{ color: "var(--text-tertiary)", display: "inline-flex" }}><Icon name={ACT_ICON[a.type]} size={16} /></span>
          <span className="body-md" style={{ flex: 1 }}>{a.text}</span>
          <span className="caption">{a.time}</span>
        </button>
      ))}
    </div>
  );
}

function DashboardPage({ navigate }) {
  const m = window.UMBRAL_DATA.metrics;
  return (
    <div className="page-fade">
      <PageHead title="Dashboard" sub="Panorama de gobernanza del proyecto Mercana" />
      <div className="metric-grid" style={{ marginBottom: 32 }}>
        <MetricCard label="Puntuación CDR" value={m.cdr.toFixed(2)} mono trend="tendencia a la baja" trendDir="good" progress={15} progressColor="var(--success)" />
        <MetricCard label="Sesiones activas" value={m.activeSessions} trend="1 terminal en uso" trendDir="good" />
        <MetricCard label="Estado de gates" value={`${m.gatesPassed}/${m.gatesTotal}`} mono trend="todos pasan" trendDir="good" progress={100} progressColor="var(--success)" />
      </div>
      <div className="section-block">
        <CompactC4 navigate={navigate} />
      </div>
      <div className="section-block">
        <h2 className="heading-lg" style={{ margin: "0 0 12px" }}>Actividad reciente</h2>
        <RecentActivity navigate={navigate} />
      </div>
    </div>
  );
}

window.DashboardPage = DashboardPage;
