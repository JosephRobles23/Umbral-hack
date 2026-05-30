/* ============================================================
   UMBRAL — Datos de ejemplo (proyecto: "Mercana", plataforma
   de comercio local). Decisiones de estructura explícita (EDE).
   ============================================================ */

window.UMBRAL_DATA = {
  project: { name: "Mercana", description: "Plataforma de comercio local" },

  metrics: {
    cdr: 0.15,            // Cognitive Debt Ratio
    cdrTrend: "down",
    activeSessions: 2,
    gatesPassed: 3,
    gatesTotal: 3,
  },

  edes: [
    {
      id: "EDE-000",
      title: "Capa de Persistencia",
      level: "anchor", tier: 3, status: "accepted", version: 1,
      topic: "persistencia",
      decision: "Usar SQLite mediante better-sqlite3 para persistencia local-first con cero dependencias externas.",
      mechanism: "Base de datos embebida con acceso síncrono. Migraciones secuenciales versionadas con rollback automático. Búsqueda de texto mediante FTS5.",
      rationale: "Arranque local-first sin servicios externos. Latencia mínima, despliegue trivial y respaldo como un único archivo. El proyecto no requiere concurrencia masiva de escritura en esta fase.",
      alternatives: "PostgreSQL — descartado por requerir un servicio externo y operación adicional. IndexedDB — descartado por estar limitado al navegador.",
      references: ["RFC-012 Estrategia de datos", "Benchmark interno SQLite vs PG (abr 2026)"],
      antiPatterns: [
        "No usar PostgreSQL ni servicios de base de datos externos.",
        "No usar ORMs pesados como Prisma o TypeORM.",
        "No exponer SQL crudo desde la capa de presentación.",
      ],
      contracts: [
        { from: "L1", to: "L2", desc: "El módulo de datos expone repositorios tipados; nunca SQL crudo hacia capas superiores." },
        { from: "L2", to: "L4", desc: "Las migraciones se ejecutan en arranque, antes de aceptar peticiones." },
      ],
      verifiedBy: ["Tests de integración con BD en memoria", "Linter que prohíbe imports de 'pg' y 'prisma'"],
      tests: {
        unit: ["Inserción y lectura de un EDE", "Rollback de migración fallida", "Consulta FTS5 con acentos"],
        sadPaths: ["Base de datos bloqueada por escritura concurrente", "Esquema corrupto al iniciar"],
        coverageTarget: 85, coverageCurrent: 78,
      },
      provenance: { phase: "Fase 1 — Cimientos", slice: "slice-data-01", createdBy: "arq.núcleo", createdAt: "2026-04-12", updatedAt: "2026-05-28" },
    },
    {
      id: "EDE-001",
      title: "DSL de Políticas (Policy as Code)",
      level: "anchor", tier: 3, status: "accepted", version: 1,
      topic: "gobernanza",
      decision: "Definir un DSL declarativo de políticas (allow / deny / require_approval) derivado de cada EDE aceptado.",
      mechanism: "Las políticas se compilan desde los anti-patrones y contratos de cada EDE a un conjunto de reglas evaluables en tiempo de commit y en CI.",
      rationale: "Convierte decisiones de arquitectura en garantías ejecutables. Evita deriva entre la intención documentada y el código real.",
      alternatives: "Revisión manual en PR — descartado por no escalar. ESLint plano — insuficiente para reglas semánticas multi-capa.",
      references: ["EDE-000", "Manual de gobernanza v2"],
      antiPatterns: [
        "No permitir políticas sin un EDE de origen rastreable.",
        "No silenciar reglas deny sin registrar deuda cognitiva.",
      ],
      contracts: [
        { from: "L2", to: "L3", desc: "El motor de políticas recibe EDEs normalizados y emite reglas inmutables." },
      ],
      verifiedBy: ["Suite de reglas de ejemplo con casos allow/deny", "Snapshot de políticas derivadas"],
      tests: {
        unit: ["Derivar política deny desde anti-patrón", "Conflicto entre dos EDEs"],
        sadPaths: ["EDE sin anti-patrones", "Regla circular"],
        coverageTarget: 80, coverageCurrent: 72,
      },
      provenance: { phase: "Fase 1 — Cimientos", slice: "slice-policy-02", createdBy: "arq.núcleo", createdAt: "2026-04-15", updatedAt: "2026-05-20" },
    },
    {
      id: "EDE-002",
      title: "Regeneración de Documentación",
      level: "navigator", tier: 2, status: "accepted", version: 2,
      topic: "documentación",
      decision: "Regenerar el modelo C4 y la documentación de arquitectura automáticamente a partir de los EDEs aceptados.",
      mechanism: "Un trabajador escucha eventos de cambio de EDE y reconstruye el grafo C4, emitiendo eventos SSE a los clientes conectados.",
      rationale: "La documentación deja de envejecer: siempre refleja las decisiones vigentes. El diagrama es un derivado, no una fuente.",
      alternatives: "Documentación manual en wiki — descartada por desactualizarse en días.",
      references: ["EDE-006", "Modelo C4 de Simon Brown"],
      antiPatterns: [
        "No editar el diagrama C4 a mano.",
        "No bloquear el hilo principal durante la regeneración.",
      ],
      contracts: [
        { from: "L4", to: "L4", desc: "El endpoint /api/doc-regen es idempotente y encolable." },
      ],
      verifiedBy: ["Test de regeneración determinista", "Comparación de snapshot del grafo"],
      tests: {
        unit: ["Regenerar C4 desde 3 EDEs", "Evento SSE emitido tras cambio"],
        sadPaths: ["EDE eliminado en mitad de la regeneración"],
        coverageTarget: 75, coverageCurrent: 81,
      },
      provenance: { phase: "Fase 2 — Visibilidad", slice: "slice-docs-04", createdBy: "equipo.dx", createdAt: "2026-04-22", updatedAt: "2026-05-29" },
    },
    {
      id: "EDE-003",
      title: "Autenticación y Sesiones",
      level: "navigator", tier: 2, status: "accepted", version: 1,
      topic: "seguridad",
      decision: "Sesiones basadas en cookies httpOnly firmadas, con tokens de corta vida y rotación silenciosa.",
      mechanism: "Cookie de sesión httpOnly + SameSite=Lax. Renovación transparente mediante un token de refresco rotatorio almacenado en BD.",
      rationale: "Evita exponer tokens a JavaScript del cliente, mitiga XSS y simplifica el cierre de sesión del lado servidor.",
      alternatives: "JWT en localStorage — descartado por superficie XSS. OAuth completo — sobredimensionado para esta fase.",
      references: ["OWASP ASVS 3.0", "EDE-000"],
      antiPatterns: [
        "No almacenar tokens de sesión en localStorage.",
        "No emitir tokens sin expiración.",
      ],
      contracts: [
        { from: "L2", to: "L4", desc: "El middleware de auth valida la firma antes de cualquier handler." },
      ],
      verifiedBy: ["Tests de expiración y rotación", "Escaneo de cabeceras de seguridad"],
      tests: {
        unit: ["Firmar y verificar cookie", "Rechazar token expirado"],
        sadPaths: ["Firma manipulada", "Reuso de token de refresco"],
        coverageTarget: 90, coverageCurrent: 88,
      },
      provenance: { phase: "Fase 2 — Visibilidad", slice: "slice-auth-03", createdBy: "equipo.seguridad", createdAt: "2026-04-25", updatedAt: "2026-05-18" },
    },
    {
      id: "EDE-004",
      title: "Búsqueda Full-Text",
      level: "explorer", tier: 1, status: "accepted", version: 1,
      topic: "búsqueda",
      decision: "Indexar catálogo y EDEs con SQLite FTS5, con tokenización que ignora acentos.",
      mechanism: "Tabla virtual FTS5 con tokenizador unicode61 y remove_diacritics. Ranking BM25 por defecto.",
      rationale: "Búsqueda relevante sin servicios externos como Elastic, reutilizando la misma base SQLite del EDE-000.",
      alternatives: "Elasticsearch — descartado por coste operativo en esta escala.",
      references: ["EDE-000"],
      antiPatterns: ["No montar un servicio de búsqueda externo para esta fase."],
      contracts: [
        { from: "L1", to: "L2", desc: "El índice se mantiene mediante triggers, no manualmente." },
      ],
      verifiedBy: ["Tests de relevancia con corpus en español"],
      tests: {
        unit: ["Buscar 'caña' encuentra 'cana'", "Ranking BM25 ordena por relevancia"],
        sadPaths: ["Consulta vacía", "Caracteres especiales en la consulta"],
        coverageTarget: 70, coverageCurrent: 74,
      },
      provenance: { phase: "Fase 3 — Producto", slice: "slice-search-05", createdBy: "equipo.producto", createdAt: "2026-05-02", updatedAt: "2026-05-22" },
    },
    {
      id: "EDE-005",
      title: "Cola de Trabajos en Segundo Plano",
      level: "navigator", tier: 2, status: "proposed", version: 1,
      topic: "infraestructura",
      decision: "Cola de trabajos in-process respaldada por SQLite para tareas diferidas (regeneración, emails, indexado).",
      mechanism: "Tabla de jobs con estados pending/running/done/failed, reintentos con backoff exponencial y un worker por tipo.",
      rationale: "Mantiene el principio local-first y evita introducir Redis o un broker externo en esta fase.",
      alternatives: "BullMQ + Redis — descartado por dependencia externa. Cron plano — sin reintentos ni visibilidad.",
      references: ["EDE-000", "EDE-002"],
      antiPatterns: [
        "No ejecutar trabajos largos de forma síncrona en el request.",
        "No reintentar indefinidamente sin tope.",
      ],
      contracts: [
        { from: "L2", to: "L4", desc: "Encolar un job es no bloqueante y devuelve un id rastreable." },
      ],
      verifiedBy: ["Tests de reintento con backoff", "Test de idempotencia de jobs"],
      tests: {
        unit: ["Encolar y procesar un job", "Backoff tras fallo"],
        sadPaths: ["Worker cae a mitad de un job", "Job envenenado"],
        coverageTarget: 80, coverageCurrent: 41,
      },
      provenance: { phase: "Fase 3 — Producto", slice: "slice-jobs-06", createdBy: "equipo.infra", createdAt: "2026-05-10", updatedAt: "2026-05-27" },
    },
    {
      id: "EDE-006",
      title: "Modelo de Eventos en Tiempo Real",
      level: "navigator", tier: 2, status: "accepted", version: 1,
      topic: "tiempo-real",
      decision: "Usar Server-Sent Events (SSE) para empujar cambios de C4 y estado de sesiones al cliente.",
      mechanism: "Un canal SSE por cliente con reconexión y backoff. Los eventos llevan un tipo y una versión de esquema.",
      rationale: "Suficiente para flujo unidireccional servidor→cliente, más simple que WebSockets y compatible con proxies HTTP.",
      alternatives: "WebSockets — reservado para la terminal (bidireccional). Polling — descartado por latencia y carga.",
      references: ["EDE-002"],
      antiPatterns: ["No usar polling para datos que ya emiten eventos."],
      contracts: [
        { from: "L4", to: "L1", desc: "Cada evento incluye un campo 'v' de versión de esquema." },
      ],
      verifiedBy: ["Test de reconexión con backoff", "Contrato de esquema de evento"],
      tests: {
        unit: ["Emitir evento de regeneración C4", "Reconectar tras caída"],
        sadPaths: ["Cliente lento que no consume", "Proxy que corta la conexión"],
        coverageTarget: 75, coverageCurrent: 70,
      },
      provenance: { phase: "Fase 2 — Visibilidad", slice: "slice-events-04", createdBy: "equipo.dx", createdAt: "2026-04-28", updatedAt: "2026-05-21" },
    },
    {
      id: "EDE-007",
      title: "Estrategia de Caché",
      level: "explorer", tier: 1, status: "deprecated", version: 1,
      topic: "rendimiento",
      decision: "Caché en memoria por proceso para respuestas de catálogo de lectura intensiva.",
      mechanism: "Mapa LRU con TTL corto, invalidado por eventos de cambio del catálogo.",
      rationale: "Reduce lecturas repetidas a SQLite en endpoints calientes.",
      alternatives: "Redis — descartado por dependencia externa.",
      references: ["EDE-004"],
      antiPatterns: ["No cachear datos sensibles de sesión."],
      contracts: [
        { from: "L2", to: "L2", desc: "La caché se invalida por evento, nunca por tiempo únicamente." },
      ],
      verifiedBy: ["Test de invalidación por evento"],
      tests: {
        unit: ["Hit y miss básico", "Invalidación por cambio"],
        sadPaths: ["Estampida de caché"],
        coverageTarget: 65, coverageCurrent: 65,
      },
      provenance: { phase: "Fase 3 — Producto", slice: "slice-cache-07", createdBy: "equipo.infra", createdAt: "2026-05-05", updatedAt: "2026-05-26" },
    },
  ],

  c4: [
    {
      layer: "system", label: "Sistema (L5)", color: "#6366F1",
      elements: [
        { name: "frontend", desc: "React 19 · App Router", rel: "→ api" },
        { name: "api", desc: "Next.js Route Handlers", rel: "→ orquestador" },
        { name: "persistencia", desc: "SQLite · better-sqlite3", rel: "" },
      ],
    },
    {
      layer: "container", label: "Contenedor (L4)", color: "#0EA5E9",
      elements: [
        { name: "bff", desc: "Backend-for-frontend", rel: "→ motor-políticas" },
        { name: "worker", desc: "Cola de trabajos", rel: "→ persistencia" },
        { name: "sse-hub", desc: "Difusión de eventos", rel: "→ frontend" },
      ],
    },
    {
      layer: "component", label: "Componente (L2/L3)", color: "#10B981",
      elements: [
        { name: "motor-políticas", desc: "Deriva reglas de EDEs", rel: "→ repositorio" },
        { name: "regenerador-c4", desc: "Reconstruye el grafo", rel: "→ sse-hub" },
        { name: "índice-fts", desc: "Búsqueda FTS5", rel: "→ repositorio" },
        { name: "auth", desc: "Sesiones firmadas", rel: "→ repositorio" },
      ],
    },
    {
      layer: "code", label: "Código (L1)", color: "#DA7756",
      elements: [
        { name: "repositorio", desc: "Acceso tipado a datos", rel: "" },
        { name: "migraciones", desc: "Esquema versionado", rel: "→ repositorio" },
        { name: "dsl-políticas", desc: "Gramática allow/deny", rel: "" },
      ],
    },
  ],

  activity: [
    { type: "ede", text: "EDE-002 actualizado a v2", time: "hace 5 min", target: "EDE-002" },
    { type: "grill", text: "Sesión Grill completada (puntuación: 78)", time: "hace 12 min", target: "grill" },
    { type: "terminal", text: "Sesión de terminal iniciada", time: "hace 2 min", target: "terminal" },
    { type: "c4", text: "Modelo C4 regenerado tras cambio en EDE-002", time: "hace 5 min", target: "c4" },
    { type: "ede", text: "EDE-005 propuesto — Cola de trabajos", time: "hace 1 h", target: "EDE-005" },
  ],

  sessions: [
    { id: "terminal-a4f2e831", kind: "terminal", status: "active", time: "hace 2 min" },
    { id: "grill-bc3197d2", kind: "grill", status: "done", time: "completada" },
  ],
};

/* Políticas derivadas de los EDEs aceptados */
window.UMBRAL_POLICIES = {
  allow: [
    { text: "Usar better-sqlite3 para la persistencia", source: "EDE-000" },
    { text: "Usar FTS5 para búsqueda de texto completo", source: "EDE-000" },
    { text: "Sesiones con cookies httpOnly firmadas", source: "EDE-003" },
    { text: "SSE para flujo de datos servidor→cliente", source: "EDE-006" },
    { text: "Derivar documentación C4 desde los EDEs", source: "EDE-002" },
  ],
  deny: [
    { text: "No usar PostgreSQL ni BD externas", source: "EDE-000" },
    { text: "No usar ORMs pesados (Prisma, TypeORM)", source: "EDE-000" },
    { text: "No almacenar tokens de sesión en localStorage", source: "EDE-003" },
    { text: "No editar el diagrama C4 a mano", source: "EDE-002" },
    { text: "No usar polling donde ya hay eventos SSE", source: "EDE-006" },
  ],
  require_approval: [
    { text: "Las migraciones de esquema requieren revisión", source: "EDE-000" },
    { text: "Silenciar una regla deny exige registrar deuda", source: "EDE-001" },
  ],
};
