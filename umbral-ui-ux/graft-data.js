/* ============================================================
   UMBRAL — Graft: grafo de conocimiento + notas (Markdown)
   Conceptos que el usuario va aprendiendo / solidificando.
   estado: aprendiendo | solidificando | dominado
   ============================================================ */
window.UMBRAL_GRAFT = {
  notes: [
    {
      id: "local-first", title: "Local-first", folder: "Fundamentos", group: "fundamentos",
      strength: 0.9, status: "dominado", links: ["sqlite", "migraciones", "deuda-cognitiva"],
      md: `# Local-first\n\n> Arrancar sin servicios externos: los datos viven junto a la app.\n\nLa arquitectura de **Mercana** es *local-first*: el estado completo cabe en un único archivo SQLite, sin servidores de base de datos que operar.\n\n## Por qué importa\n- **Latencia mínima** — el acceso es síncrono y en proceso.\n- **Despliegue trivial** — copiar un archivo es el respaldo.\n- **Cero dependencias** de infraestructura externa en las primeras fases.\n\n## Conceptos relacionados\n- [[SQLite]] como motor embebido\n- [[Migraciones]] para evolucionar el esquema\n\n## Cuándo NO aplica\nCuando se requiera concurrencia masiva de escritura o múltiples nodos. Ahí reevaluar (ver \`EDE-000\` → alternativas).`,
    },
    {
      id: "sqlite", title: "SQLite", folder: "Fundamentos", group: "fundamentos",
      strength: 0.85, status: "dominado", links: ["fts5", "migraciones", "cola-trabajos"],
      md: `# SQLite\n\nMotor de base de datos **embebido**, accedido vía \`better-sqlite3\` (API síncrona).\n\n## Características usadas\n| Capacidad | Uso en Mercana |\n|---|---|\n| FTS5 | Búsqueda de texto completo |\n| WAL | Lecturas concurrentes |\n| Transacciones | Migraciones atómicas |\n\n## Ejemplo\n\`\`\`ts\nconst stmt = db.prepare('SELECT * FROM edes WHERE id = ?');\nconst ede = stmt.get('EDE-000');\n\`\`\`\n\nRelacionado: [[Local-first]], [[FTS5]].`,
    },
    {
      id: "migraciones", title: "Migraciones", folder: "Fundamentos", group: "fundamentos",
      strength: 0.6, status: "solidificando", links: ["sqlite"],
      md: `# Migraciones\n\nCambios de esquema **versionados y secuenciales**, con *rollback* automático ante fallo.\n\n## Reglas\n1. Cada migración tiene un número incremental.\n2. Se ejecutan en arranque, **antes** de aceptar peticiones.\n3. Una migración fallida revierte la transacción completa.\n\n> ⚠️ Las migraciones de esquema **requieren aprobación** (política derivada de \`EDE-000\`).`,
    },
    {
      id: "ede", title: "EDE", folder: "Gobernanza", group: "gobernanza",
      strength: 0.95, status: "dominado", links: ["policy-as-code", "deuda-cognitiva", "gates", "modelo-c4"],
      md: `# EDE — Decisión de Estructura Explícita\n\nUna **EDE** captura una decisión de arquitectura con su *qué*, *cómo* y *por qué*, además de los **anti-patrones** que prohíbe.\n\n## Anatomía\n- **Decisión** y **mecanismo**\n- **Justificación** y alternativas descartadas\n- **Contratos** entre capas\n- **Anti-patrones** (lo PROHIBIDO)\n- **Pruebas** que la verifican\n\nDe cada EDE aceptada se deriva [[Policy as Code]] y se regenera el [[Modelo C4]].`,
    },
    {
      id: "policy-as-code", title: "Policy as Code", folder: "Gobernanza", group: "gobernanza",
      strength: 0.7, status: "solidificando", links: ["ede", "gates"],
      md: `# Policy as Code\n\nLas decisiones se compilan a un **DSL declarativo** de reglas: \`allow\`, \`deny\`, \`require_approval\`.\n\n\`\`\`text\ndeny  uso_de "postgres"        from EDE-000\ndeny  uso_de "localStorage"    from EDE-003\nallow uso_de "better-sqlite3"  from EDE-000\n\`\`\`\n\nSe evalúan en **commit** y en **CI**. Silenciar una regla \`deny\` registra [[Deuda cognitiva]].`,
    },
    {
      id: "deuda-cognitiva", title: "Deuda cognitiva", folder: "Gobernanza", group: "gobernanza",
      strength: 0.5, status: "solidificando", links: ["ede", "gates"],
      md: `# Deuda cognitiva\n\nMedida de la **brecha** entre la intención documentada y lo que el equipo realmente comprende o implementa.\n\n## CDR — Cognitive Debt Ratio\nIndicador agregado (0–1). En Mercana hoy: **0.15** ▼ (tendencia a la baja).\n\nSe incrementa al **anular** una sesión [[Grill Me]] sin alcanzar alineación, o al silenciar reglas \`deny\`.`,
    },
    {
      id: "gates", title: "Gates de calidad", folder: "Gobernanza", group: "gobernanza",
      strength: 0.4, status: "aprendiendo", links: ["policy-as-code", "deuda-cognitiva"],
      md: `# Gates de calidad\n\nComprobaciones que **bloquean** la integración si no se cumplen.\n\n- Cobertura de pruebas mínima por EDE\n- Sin reglas \`deny\` violadas\n- Sin deuda cognitiva por encima del umbral\n\nEstado actual: **3/3 pasan** ✓`,
    },
    {
      id: "modelo-c4", title: "Modelo C4", folder: "Arquitectura", group: "arquitectura",
      strength: 0.65, status: "solidificando", links: ["sse", "ede"],
      md: `# Modelo C4\n\nDocumentación de arquitectura en **cuatro niveles**: Sistema, Contenedor, Componente, Código.\n\nEn Umbral el diagrama es un **derivado**, no una fuente: se regenera automáticamente desde las EDEs y se empuja al cliente vía [[SSE]].\n\n> No editar el diagrama a mano (política de \`EDE-002\`).`,
    },
    {
      id: "sse", title: "SSE", folder: "Arquitectura", group: "arquitectura",
      strength: 0.55, status: "solidificando", links: ["modelo-c4", "cola-trabajos"],
      md: `# SSE — Server-Sent Events\n\nCanal **unidireccional** servidor → cliente para empujar cambios (regeneración de C4, estado de sesiones).\n\n## Por qué SSE y no WebSockets\n- Flujo en un solo sentido → más simple.\n- Compatible con proxies HTTP.\n- Reconexión con *backoff* integrada.\n\nWebSockets se reserva para la [[Terminal]] (bidireccional).`,
    },
    {
      id: "cola-trabajos", title: "Cola de trabajos", folder: "Arquitectura", group: "arquitectura",
      strength: 0.3, status: "aprendiendo", links: ["sqlite", "sse"],
      md: `# Cola de trabajos\n\nTareas diferidas (regeneración, emails, indexado) respaldadas por **SQLite**, sin Redis.\n\nEstados: \`pending → running → done | failed\`, con **reintentos** y *backoff* exponencial.\n\n> Propuesta en \`EDE-005\` — aún sin aceptar. Cobertura de pruebas baja (41%).`,
    },
    {
      id: "sesiones", title: "Sesiones", folder: "Seguridad", group: "seguridad",
      strength: 0.75, status: "solidificando", links: ["cookies-httponly"],
      md: `# Sesiones\n\nBasadas en **cookies \`httpOnly\` firmadas**, con tokens de corta vida y **rotación silenciosa**.\n\n- \`SameSite=Lax\`\n- Renovación transparente vía token de refresco rotatorio\n- Cierre de sesión del lado servidor\n\nNunca guardar tokens en [[localStorage]] (política de \`EDE-003\`).`,
    },
    {
      id: "cookies-httponly", title: "Cookies httpOnly", folder: "Seguridad", group: "seguridad",
      strength: 0.6, status: "solidificando", links: ["sesiones"],
      md: `# Cookies httpOnly\n\nCookies inaccesibles desde JavaScript del cliente → mitigan **XSS**.\n\n\`\`\`http\nSet-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax\n\`\`\`\n\nClave para [[Sesiones]] seguras.`,
    },
    {
      id: "fts5", title: "FTS5", folder: "Búsqueda", group: "busqueda",
      strength: 0.45, status: "aprendiendo", links: ["sqlite", "bm25"],
      md: `# FTS5\n\nTabla virtual de **búsqueda de texto completo** en SQLite.\n\n- Tokenizador \`unicode61\` con \`remove_diacritics\` → *buscar “caña” encuentra “cana”*.\n- Ranking [[BM25]] por defecto.\n- Índice mantenido por *triggers*, no a mano.`,
    },
    {
      id: "bm25", title: "BM25", folder: "Búsqueda", group: "busqueda",
      strength: 0.25, status: "aprendiendo", links: ["fts5"],
      md: `# BM25\n\nFunción de **ranking** que ordena resultados por relevancia, balanceando frecuencia de término y longitud del documento.\n\nEs el ranking por defecto de [[FTS5]]. Aún consolidando la intuición de sus parámetros \`k1\` y \`b\`.`,
    },
  ],

  // Árbol de archivos estilo Obsidian
  tree: [
    { type: "folder", name: "Fundamentos", children: [
      { type: "note", id: "local-first" }, { type: "note", id: "sqlite" }, { type: "note", id: "migraciones" },
    ] },
    { type: "folder", name: "Gobernanza", children: [
      { type: "note", id: "ede" }, { type: "note", id: "policy-as-code" }, { type: "note", id: "deuda-cognitiva" }, { type: "note", id: "gates" },
    ] },
    { type: "folder", name: "Arquitectura", children: [
      { type: "note", id: "modelo-c4" }, { type: "note", id: "sse" }, { type: "note", id: "cola-trabajos" },
    ] },
    { type: "folder", name: "Seguridad", children: [
      { type: "note", id: "sesiones" }, { type: "note", id: "cookies-httponly" },
    ] },
    { type: "folder", name: "Búsqueda", children: [
      { type: "note", id: "fts5" }, { type: "note", id: "bm25" },
    ] },
  ],

  groupColors: {
    fundamentos: "#0EA5E9",
    gobernanza: "#DA7756",
    arquitectura: "#8B5CF6",
    seguridad: "#2D7D46",
    busqueda: "#C17E2F",
  },
  groupLabels: {
    fundamentos: "Fundamentos",
    gobernanza: "Gobernanza",
    arquitectura: "Arquitectura",
    seguridad: "Seguridad",
    busqueda: "Búsqueda",
  },
  statusLabels: {
    aprendiendo: "Aprendiendo",
    solidificando: "Solidificando",
    dominado: "Dominado",
  },
};
