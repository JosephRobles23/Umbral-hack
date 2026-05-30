/* ============================================================
   UMBRAL — Sidebar
   ============================================================ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "operatives", label: "Operativos", icon: "hexagon" },
  { id: "grill", label: "Grill Me", icon: "flame" },
  { id: "terminal", label: "Terminal", icon: "square-terminal" },
  { id: "c4", label: "Modelo C4", icon: "layers" },
  { id: "graft", label: "Graft", icon: "share-2" },
  { id: "policies", label: "Políticas", icon: "shield-check" },
];

function Sidebar({ route, navigate }) {
  const D = window.UMBRAL_DATA;
  const m = D.metrics;
  const active = route.page;
  return (
    <nav className="sidebar" aria-label="Navegación principal">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 4 6.5V12c0 4.5 3.2 7.2 8 9 4.8-1.8 8-4.5 8-9V6.5z" />
            <path d="M9 11.5h6M12 8.5v6" opacity="0.85" />
          </svg>
        </span>
        <span className="brand-name">Umbral</span>
      </div>
      <div className="divider" />

      <div className="nav-list">
        {NAV_ITEMS.map(it => (
          <button key={it.id} className={`nav-item${active === it.id ? " active" : ""}`} onClick={() => navigate(it.id)}>
            <Icon name={it.icon} size={20} />
            {it.label}
          </button>
        ))}
      </div>

      <div className="sidebar-foot">
        <div>
          <div className="sidebar-section-title">Estado del sistema</div>
          <div className="status-row"><span>CDR</span><span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{m.cdr.toFixed(2)}</span></div>
          <div className="status-row">
            <span>Gates</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--success)" }}>
              <Icon name="check" size={13} />{m.gatesPassed}/{m.gatesTotal}
            </span>
          </div>
        </div>

        <div>
          <div className="sidebar-section-title">Sesiones</div>
          {D.sessions.map(s => (
            <button key={s.id} className="session-row" style={{ border: "none", background: "transparent", cursor: "pointer", padding: "2px 0", width: "100%" }}
              onClick={() => navigate(s.kind)}>
              <span className={`dot dot-${s.status === "active" ? "info" : "muted"}${s.status === "active" ? " dot-pulse" : ""}`} style={{ width: 6, height: 6 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.id.slice(0, 16)}</span>
              <span className="t">{s.time}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

window.Sidebar = Sidebar;
window.NAV_ITEMS = NAV_ITEMS;
