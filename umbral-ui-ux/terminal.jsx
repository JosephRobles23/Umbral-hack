/* ============================================================
   UMBRAL — Terminal (vista oscura, comandos simulados)
   ============================================================ */
const SHELL_OPTS = [
  { value: "claude", label: "Claude Code" },
  { value: "pwsh", label: "PowerShell" },
  { value: "cmd", label: "CMD" },
  { value: "bash", label: "Bash" },
];
function edeContextOpts() {
  return [{ value: "all", label: "Todos los EDEs" }, ...window.UMBRAL_DATA.edes.map(e => ({ value: e.id, label: `${e.id} — ${e.title}` }))];
}

const PROMPT = "mercana@umbral:~$";

// Procesa un comando y devuelve líneas (array de {html} o string)
function runCommand(cmd) {
  const c = cmd.trim();
  const D = window.UMBRAL_DATA;
  if (c === "") return [];
  const parts = c.split(/\s+/);
  const head = parts[0];

  if (head === "help") return [
    { t: "Comandos disponibles:", cls: "c-cyan" },
    "  umbral status        Estado de gobernanza (CDR, gates)",
    "  umbral edes          Lista de operativos (EDE)",
    "  umbral policies      Políticas activas derivadas",
    "  claude               Inicia Claude Code",
    "  ls / pwd / whoami    Utilidades del sistema",
    "  clear                Limpia la terminal",
  ];
  if (c === "umbral status") return [
    { t: "Umbral · proyecto Mercana", cls: "c-accent" },
    `  CDR (Cognitive Debt Ratio)  ${D.metrics.cdr.toFixed(2)}  ▼`,
    { t: `  Gates                       ${D.metrics.gatesPassed}/${D.metrics.gatesTotal} ✓ todos pasan`, cls: "c-green" },
    `  Sesiones activas            ${D.metrics.activeSessions}`,
  ];
  if (c === "umbral edes") return D.edes.map(e => ({
    t: `  ${e.id.padEnd(9)} ${e.status === "accepted" ? "✓" : e.status === "proposed" ? "·" : "✕"}  ${e.title}`,
    cls: e.status === "accepted" ? "c-green" : e.status === "proposed" ? "c-yellow" : "c-dim",
  }));
  if (c === "umbral policies") return [
    { t: "ALLOW", cls: "c-green" }, ...D.edes && window.UMBRAL_POLICIES.allow.slice(0, 3).map(p => `  ● ${p.text}`),
    { t: "DENY", cls: "c-red" }, ...window.UMBRAL_POLICIES.deny.slice(0, 3).map(p => `  ✕ ${p.text}`),
  ];
  if (head === "umbral") return [{ t: `umbral: subcomando desconocido '${parts[1] || ""}'. Prueba 'umbral status'.`, cls: "c-red" }];
  if (head === "claude") return [
    "",
    { box: true, lines: [
      { t: "Claude Code v1.2.3", cls: "c-accent" },
      "",
      { t: "> ¿En qué te gustaría trabajar hoy?", cls: "" },
    ] },
    "",
    { t: "Sugerencia: escribe 'umbral status' para ver el estado de gobernanza antes de empezar.", cls: "c-dim" },
  ];
  if (head === "ls") return [{ t: "app/  components/  data/  policies.dsl  umbral.config.ts  package.json", cls: "c-blue" }];
  if (head === "pwd") return ["/home/mercana/proyecto"];
  if (head === "whoami") return ["mercana"];
  if (head === "echo") return [parts.slice(1).join(" ")];
  if (head === "clear") return [{ clear: true }];
  return [{ t: `comando no encontrado: ${head}. Escribe 'help'.`, cls: "c-red" }];
}

function TerminalBody({ shellLabel }) {
  const initial = [
    { t: `Sesión iniciada · ${shellLabel}`, cls: "c-dim" },
    { t: "Umbral terminal — escribe 'help' para ver los comandos.", cls: "c-dim" },
    "",
  ];
  const [history, setHistory] = useState(initial);
  const [input, setInput] = useState("");
  const [cmdHist, setCmdHist] = useState([]);
  const [hPos, setHPos] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [history]);

  function submit() {
    const cmd = input;
    const out = runCommand(cmd);
    if (out.some(l => l && l.clear)) { setHistory([]); setInput(""); setCmdHist(h => [cmd, ...h]); setHPos(-1); return; }
    setHistory(h => [...h, { prompt: true, cmd }, ...out, ""]);
    if (cmd.trim()) setCmdHist(h => [cmd, ...h]);
    setInput(""); setHPos(-1);
  }
  function onKey(e) {
    if (e.key === "Enter") submit();
    else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(cmdHist.length - 1, hPos + 1); if (n >= 0) { setHPos(n); setInput(cmdHist[n]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const n = hPos - 1; if (n < 0) { setHPos(-1); setInput(""); } else { setHPos(n); setInput(cmdHist[n]); } }
  }

  function renderLine(l, i) {
    if (l === "" || l == null) return <div key={i} className="term-line">&nbsp;</div>;
    if (l.prompt) return <div key={i} className="term-line"><span className="term-prompt">{PROMPT}</span> {l.cmd}</div>;
    if (l.box) return (
      <div key={i} className="term-box">
        {l.lines.map((bl, j) => <div key={j} className={`term-line ${bl.cls || ""}`}>{bl.t || (bl === "" ? "\u00a0" : bl)}</div>)}
      </div>
    );
    if (typeof l === "string") return <div key={i} className="term-line">{l}</div>;
    return <div key={i} className={`term-line ${l.cls || ""}`}>{l.t}</div>;
  }

  return (
    <div className="term-body" ref={bodyRef} onClick={() => inputRef.current && inputRef.current.focus()}>
      {history.map(renderLine)}
      <div className="term-input-line">
        <span className="term-prompt" style={{ marginRight: 8 }}>{PROMPT}</span>
        <input ref={inputRef} value={input} autoFocus spellCheck={false}
          onChange={e => setInput(e.target.value)} onKeyDown={onKey} />
        <span className="term-cursor" style={{ opacity: input ? 0 : 1 }} />
      </div>
    </div>
  );
}

function ActiveTerminal({ session, onKill }) {
  const [tabs, setTabs] = useState([{ id: 1, label: session.shellLabel, key: Date.now() }]);
  const [activeTab, setActiveTab] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const nextId = useRef(2);

  function addTab() {
    const id = nextId.current++;
    setTabs(t => [...t, { id, label: "claude", key: Date.now() }]);
    setActiveTab(id);
  }
  function closeTab(id, e) {
    e.stopPropagation();
    setTabs(t => {
      const nt = t.filter(x => x.id !== id);
      if (nt.length === 0) { onKill(); return t; }
      if (activeTab === id) setActiveTab(nt[nt.length - 1].id);
      return nt;
    });
  }
  const cur = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className="term-container">
      <div className="term-bar">
        <div className="traffic">
          <span className="light red" title="Cerrar sesión" onClick={() => setConfirm(true)} />
          <span className="light yellow" />
          <span className="light green" />
        </div>
        <span className="term-session-id">session: {session.id.slice(0, 8)}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#66C45A" }}>
          <span className="dot" style={{ width: 6, height: 6, background: "#66C45A" }} /> conectado
        </span>
      </div>
      <div className="term-tabbar">
        {tabs.map(t => (
          <button key={t.id} className={`term-tab${t.id === activeTab ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
            <span className="close" onClick={e => closeTab(t.id, e)}><Icon name="x" size={12} /></span>
          </button>
        ))}
        <button className="term-newtab" title="Nueva pestaña" onClick={addTab}>+</button>
      </div>
      {/* key forces a fresh body per tab */}
      <TerminalBody key={cur.key} shellLabel={cur.label} />

      {confirm && (
        <Modal title="¿Cerrar sesión?" danger onClose={() => setConfirm(false)}
          actions={<>
            <Button variant="secondary" onClick={() => setConfirm(false)}>Cancelar</Button>
            <Button variant="danger" onClick={onKill}>Cerrar</Button>
          </>}>
          Esto terminará la sesión de terminal y cualquier proceso en ejecución.
        </Modal>
      )}
    </div>
  );
}

function TerminalPage() {
  const [shell, setShell] = useState("claude");
  const [ctx, setCtx] = useState("all");
  const [session, setSession] = useState(null);
  const [launching, setLaunching] = useState(false);
  const toast = useToast();

  function launch() {
    setLaunching(true);
    setTimeout(() => {
      const id = "a4f2e831" + Math.random().toString(16).slice(2, 6);
      setSession({ id, shellLabel: SHELL_OPTS.find(s => s.value === shell).label, ctx });
      setLaunching(false);
    }, 700);
  }
  function kill() { setSession(null); toast({ variant: "info", message: "Sesión de terminal cerrada." }); }

  return (
    <div className="term-page">
      {!session ? (
        <div className="term-launcher">
          <h2 className="heading-lg" style={{ margin: "0 0 20px", color: "var(--term-text)" }}>Lanzar terminal</h2>
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Shell</label>
            <Select value={shell} options={SHELL_OPTS} onChange={setShell} dark />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Contexto EDE (opcional)</label>
            <Select value={ctx} options={edeContextOpts()} onChange={setCtx} dark />
          </div>
          <Button className="btn-block" loading={launching} onClick={launch} icon={launching ? null : <Icon name="square-terminal" size={16} />}>
            Lanzar terminal
          </Button>
        </div>
      ) : (
        <ActiveTerminal session={session} onKill={kill} />
      )}
    </div>
  );
}

window.TerminalPage = TerminalPage;
