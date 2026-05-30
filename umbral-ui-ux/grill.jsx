/* ============================================================
   UMBRAL — Grill Me (sesión de alineación interactiva)
   ============================================================ */
const GRILL_THRESHOLD = 60;   // puntos para considerarse ALINEADO
const GRILL_MAX = 70;          // tope de la barra

// Banco de preguntas por EDE (cae a un set genérico si no existe)
const GRILL_QUESTIONS = {
  "EDE-000": [
    { level: "navigator", topic: "persistencia", text: "¿Qué mecanismo de migración usarías si necesitas alterar el esquema después de que los usuarios ya tienen datos?" },
    { level: "anchor", topic: "límites", text: "¿Por qué SQLite y no PostgreSQL para este caso específico? Nombra el límite que esta decisión NO debe cruzar." },
    { level: "navigator", topic: "concurrencia", text: "better-sqlite3 es síncrono. ¿Cómo evitas bloquear el hilo principal ante escrituras pesadas?" },
  ],
  "EDE-001": [
    { level: "anchor", topic: "trazabilidad", text: "¿Cómo garantizas que cada política tenga un EDE de origen rastreable?" },
    { level: "navigator", topic: "conflictos", text: "Dos EDEs producen reglas en conflicto (allow vs deny). ¿Cómo resuelve el motor el conflicto?" },
    { level: "explorer", topic: "deuda", text: "¿Qué ocurre cuando un desarrollador silencia una regla deny?" },
  ],
};
const GRILL_DEFAULT = [
  { level: "navigator", topic: "mecanismo", text: "Explica el mecanismo central de esta decisión con tus propias palabras." },
  { level: "anchor", topic: "límites", text: "¿Cuál es el límite explícito que esta decisión no debe cruzar?" },
  { level: "explorer", topic: "alternativas", text: "¿Qué alternativa descartaste y por qué?" },
];

function gradeAnswer(text) {
  const len = text.trim().length;
  const rich = /\b(porque|mediante|evita|garantiza|límite|migración|rollback|idempotente|contrato|backoff|transacción|índice|esquema)\b/i.test(text);
  let base;
  if (len < 15) base = 32 + Math.floor(Math.random() * 12);
  else if (len < 60) base = 58 + Math.floor(Math.random() * 14);
  else base = 80 + Math.floor(Math.random() * 13);
  if (rich) base = Math.min(98, base + 8);
  const score = Math.max(20, Math.min(98, base));
  let feedback;
  if (score >= 80) feedback = "Excelente comprensión del mecanismo y sus límites. Bien fundamentado.";
  else if (score >= 60) feedback = "Comprensión razonable; podrías ser más explícito sobre los límites de la decisión.";
  else feedback = "Respuesta superficial: falta justificar el porqué y los anti-patrones implicados.";
  return { score, feedback };
}

function ScoreBadge({ score }) {
  const variant = score >= 70 ? "success" : score >= 50 ? "warning" : "error";
  return <span className={`badge badge-${variant}`} style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{score}/100</span>;
}

function QuestionCard({ q, index, answer, onSubmit, disabled }) {
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);
  const answered = !!answer;
  function send() {
    if (!val.trim() || busy) return;
    setBusy(true);
    setTimeout(() => { onSubmit(index, val); setBusy(false); }, 650);
  }
  return (
    <div className="card stagger-in" style={{ padding: 24, marginBottom: 16, background: answered ? "var(--bg-sidebar)" : "#fff", transition: "background-color 300ms ease" }}>
      <div className="overline" style={{ color: LEVEL_VAR[q.level] }}>{LEVEL_LABEL[q.level]} — {q.topic}</div>
      <p className="body-lg" style={{ color: "var(--text-primary)", lineHeight: 1.6, margin: "12px 0 16px" }}>“{q.text}”</p>
      {answered ? (
        <div>
          <div className="label-sm text-tertiary" style={{ marginBottom: 4 }}>Tu respuesta</div>
          <p className="body-sm text-secondary" style={{ margin: "0 0 12px" }}>{answer.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ScoreBadge score={answer.score} />
            <span className="body-sm text-secondary" style={{ fontStyle: "italic" }}>{answer.feedback}</span>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          <input className="input" style={{ flex: 1 }} placeholder="Tu respuesta…" value={val} disabled={disabled || busy}
            onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") send(); }} />
          <Button onClick={send} disabled={disabled || !val.trim() || busy} icon={busy ? null : <Icon name="send" size={15} />}>
            {busy ? <span className="spinner" /> : "Enviar"}
          </Button>
        </div>
      )}
    </div>
  );
}

function GrillSession({ ede, onReset }) {
  const questions = GRILL_QUESTIONS[ede.id] || GRILL_DEFAULT;
  const [answers, setAnswers] = useState({});
  const [overridden, setOverridden] = useState(false);
  const toast = useToast();

  const answeredArr = Object.values(answers);
  const perQ = GRILL_MAX / questions.length;
  const alignmentScore = Math.round(answeredArr.reduce((s, a) => s + (a.score / 100) * perQ, 0));
  const allAnswered = answeredArr.length === questions.length;
  const aligned = allAnswered && alignmentScore >= GRILL_THRESHOLD;

  let statusBadge;
  if (overridden) statusBadge = <Badge variant="warning" upper>Anulado</Badge>;
  else if (aligned) statusBadge = <Badge variant="success" upper>Alineado</Badge>;
  else statusBadge = <Badge variant="info" upper>En progreso</Badge>;

  function submit(i, text) {
    const g = gradeAnswer(text);
    setAnswers(a => ({ ...a, [i]: { text, ...g } }));
  }
  function doOverride() {
    setOverridden(true);
    toast({ variant: "warning", message: `Deuda cognitiva registrada: brecha de ${GRILL_MAX - alignmentScore} puntos.` });
  }
  useEffect(() => { if (aligned && !overridden) toast({ variant: "success", message: "¡Alineación alcanzada! Ya puedes diseñar." }); }, [aligned]);

  const showOverride = alignmentScore > 0 && !aligned && !overridden;

  return (
    <div className="page-fade">
      <div className="page-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 className="display-lg" style={{ margin: 0 }}>Grill Me — {ede.id}</h1>
          <p className="sub" style={{ margin: 0 }}>{ede.title}</p>
        </div>
        <Button variant="secondary" onClick={onReset}>Terminar sesión</Button>
      </div>

      <div style={{ marginBottom: 32, maxWidth: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="label-sm text-secondary">Puntuación de alineación</span>
          <span className="mono-sm" style={{ color: "var(--text-primary)", fontWeight: 600 }}>{alignmentScore}/{GRILL_MAX}</span>
        </div>
        <div className="progress"><div className="progress-fill" style={{ width: (alignmentScore / GRILL_MAX * 100) + "%", background: colorForPct(alignmentScore / GRILL_MAX * 100) }} /></div>
        <div style={{ marginTop: 10 }}>{statusBadge}</div>
      </div>

      {questions.map((q, i) => (
        <QuestionCard key={i} q={q} index={i} answer={answers[i]} onSubmit={submit} disabled={overridden} />
      ))}

      {showOverride && (
        <div className="card" style={{ background: "var(--warning-subtle)", borderColor: "var(--warning)", padding: 20, marginTop: 24 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <span style={{ color: "var(--warning)", display: "inline-flex", flexShrink: 0, marginTop: 1 }}><Icon name="alert-triangle" size={18} /></span>
            <span className="body-sm text-secondary">¿No logras alinear? Puedes anular, pero quedará registrado como <strong>deuda cognitiva</strong>.</span>
          </div>
          <Button variant="warning" onClick={doOverride}>Anular (registrar deuda)</Button>
        </div>
      )}

      {overridden && (
        <div className="card" style={{ background: "var(--warning-subtle)", borderColor: "var(--warning)", padding: 16, marginTop: 16 }}>
          <span className="body-sm" style={{ color: "var(--warning)" }}>
            Deuda cognitiva registrada: brecha de {GRILL_MAX - alignmentScore} puntos. Esta decisión continúa bajo observación.
          </span>
        </div>
      )}
    </div>
  );
}

function GrillPage() {
  const edes = window.UMBRAL_DATA.edes;
  const [selected, setSelected] = useState(edes[0].id);
  const [active, setActive] = useState(null);
  const [starting, setStarting] = useState(false);
  const opts = edes.map(e => ({ value: e.id, label: `${e.id} — ${e.title}` }));

  function start() {
    setStarting(true);
    setTimeout(() => { setActive(edes.find(e => e.id === selected)); setStarting(false); }, 700);
  }

  if (active) return <GrillSession ede={active} onReset={() => setActive(null)} />;

  return (
    <div className="page-fade">
      <PageHead title="Grill Me" sub="Sesión de alineación — la IA interroga antes de permitir el diseño" />
      <div className="card" style={{ padding: 40, maxWidth: 480, margin: "0 auto", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <span style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <Icon name="flame" size={26} />
          </span>
        </div>
        <div className="label-md text-secondary" style={{ marginBottom: 8 }}>Selecciona el EDE a evaluar</div>
        <Select value={selected} options={opts} onChange={setSelected} />
        <Button className="btn-block" style={{ marginTop: 16 }} loading={starting} onClick={start}>
          Iniciar sesión Grill
        </Button>
      </div>
    </div>
  );
}

window.GrillPage = GrillPage;
