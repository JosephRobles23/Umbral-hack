/* ============================================================
   UMBRAL — Primitivas UI compartidas
   ============================================================ */
const { useState, useRef, useEffect, createContext, useContext, useCallback } = React;

const LEVEL_LABEL = { explorer: "EXPLORER", navigator: "NAVIGATOR", anchor: "ANCHOR" };
const LEVEL_VAR = { explorer: "var(--level-explorer)", navigator: "var(--level-navigator)", anchor: "var(--level-anchor)" };
const STATUS_MAP = {
  accepted: { label: "ACEPTADO", cls: "badge-success" },
  proposed: { label: "PROPUESTO", cls: "badge-info" },
  deprecated: { label: "OBSOLETO", cls: "badge-neutral" },
};

/* ---- Button ---- */
function Button({ variant = "primary", loading, children, icon, className = "", ...rest }) {
  const cls = { primary: "btn-primary", secondary: "btn-secondary", ghost: "btn-ghost", danger: "btn-danger", warning: "btn-warning" }[variant] || "btn-primary";
  return (
    <button className={`btn ${cls} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? <><span className="spinner" /> Cargando…</> : <>{icon}{children}</>}
    </button>
  );
}

/* ---- Badge ---- */
function Badge({ variant = "neutral", upper, children }) {
  return <span className={`badge badge-${variant}${upper ? " upper" : ""}`}>{children}</span>;
}
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.proposed;
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

/* ---- Status dot ---- */
function StatusDot({ variant = "muted", label, pulse }) {
  return (
    <span className="status" style={{ color: `var(--${variant === "success" ? "success" : variant === "info" ? "info" : variant === "warning" ? "warning" : variant === "error" ? "error" : "text-secondary"})` }}>
      <span className={`dot dot-${variant}${pulse ? " dot-pulse" : ""}`} />
      {label}
    </span>
  );
}

/* ---- Progress ---- */
function colorForPct(pct) {
  if (pct < 31) return "var(--error)";
  if (pct < 70) return "var(--warning)";
  return "var(--success)";
}
function Progress({ value, max = 100, showLabel, labelFmt }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 60); return () => clearTimeout(t); }, [pct]);
  return (
    <div>
      <div className="progress"><div className="progress-fill" style={{ width: w + "%", background: colorForPct(pct) }} /></div>
      {showLabel && <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}><span className="mono-sm text-secondary">{labelFmt ? labelFmt : `${value}/${max}`}</span></div>}
    </div>
  );
}

/* ---- Complexity badge (circle) ---- */
function ComplexityBadge({ level, tier, size = 40 }) {
  return (
    <span className="complexity-badge" style={{ background: LEVEL_VAR[level], width: size, height: size, fontSize: size > 44 ? 15 : 13 }}>
      T{tier}
    </span>
  );
}

/* ---- Select (custom dropdown) ---- */
function Select({ value, options, onChange, placeholder = "Seleccionar…", dark }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const current = options.find(o => o.value === value);
  return (
    <div className="select" ref={ref}>
      <button type="button" className={`select-trigger${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}
        style={dark ? { background: "var(--term-bg)", borderColor: "var(--term-border)", color: "var(--term-text)" } : {}}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current ? current.label : placeholder}</span>
        <Icon name="chevron-down" size={16} className="chev" />
      </button>
      {open && (
        <div className="select-menu" style={dark ? { background: "var(--term-surface)", borderColor: "var(--term-border)" } : {}}>
          {options.map(o => (
            <div key={o.value} className={`select-option${o.value === value ? " selected" : ""}`}
              style={dark && o.value !== value ? { color: "var(--term-text)" } : {}}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.label}</span>
              {o.value === value && <Icon name="check" size={16} className="chk" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Modal ---- */
function Modal({ title, children, onClose, actions, danger }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          {danger && <span style={{ color: "var(--error)", display: "inline-flex" }}><Icon name="alert-triangle" size={20} /></span>}
          <h2 className="heading-lg" style={{ margin: 0 }}>{title}</h2>
        </div>
        <div className="body-md text-secondary">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}

/* ---- Toast system ---- */
const ToastCtx = createContext(() => {});
function useToast() { return useContext(ToastCtx); }
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    const toast = typeof opts === "string" ? { id, message: opts, variant: "success" } : { id, variant: "success", ...opts };
    setToasts(t => [...t, toast]);
    const auto = toast.variant === "success" || toast.variant === "info";
    if (auto) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
    return id;
  }, []);
  const dismiss = (id) => setToasts(t => t.filter(x => x.id !== id));
  const ICONS = { success: "check-circle", error: "x-circle", warning: "alert-triangle", info: "info" };
  const COLORS = { success: "var(--success)", error: "var(--error)", warning: "var(--warning)", info: "var(--info)" };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span style={{ color: COLORS[t.variant], display: "inline-flex", flexShrink: 0 }}><Icon name={ICONS[t.variant]} size={18} /></span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => dismiss(t.id)}><Icon name="x" size={14} /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---- Page header ---- */
function PageHead({ title, sub, right }) {
  return (
    <div className="page-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <h1 className="display-lg" style={{ margin: 0 }}>{title}</h1>
        {sub && <p className="sub" style={{ margin: 0 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

Object.assign(window, {
  Button, Badge, StatusBadge, StatusDot, Progress, ComplexityBadge, Select, Modal,
  ToastProvider, useToast, PageHead, colorForPct,
  LEVEL_LABEL, LEVEL_VAR, STATUS_MAP,
});
