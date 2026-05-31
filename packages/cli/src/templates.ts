import type { CognitiveLevel, ComplexityTier } from "@umbral/contracts";
import type { Detection } from "./detect/types.js";

interface EdeTemplate {
  slugs: string[];
  cognitiveLevel: CognitiveLevel;
  complexityTier: ComplexityTier;
  title: (d: Detection) => string;
  decision: (d: Detection) => string;
  mechanism: (d: Detection) => string;
  rationale: (d: Detection) => string;
  alternatives: (d: Detection) => { option: string; rejectedBecause: string }[];
  antiPatterns: (d: Detection) => string[];
}

const TEMPLATES: EdeTemplate[] = [
  {
    slugs: ["nextjs-app-router"],
    cognitiveLevel: "navigator",
    complexityTier: 2,
    title: () => "Next.js App Router como framework frontend",
    decision: (d) => `El frontend utiliza Next.js ${(d.metadata.version as string) ?? ""} con App Router para renderizado y routing.`.trim(),
    mechanism: () => "App Router con Server Components por defecto. Rutas en app/. API routes en app/api/. Client Components marcados explicitamente con 'use client'.",
    rationale: () => "Next.js App Router provee Server Components, streaming y layouts anidados. Simplifica el data-fetching server-side y mejora el rendimiento versus client-side rendering puro.",
    alternatives: () => [
      { option: "Pages Router", rejectedBecause: "Patron legacy; App Router es el futuro de Next.js." },
      { option: "Remix", rejectedBecause: "Ecosistema mas reducido; Next.js tiene mayor adopcion y soporte." },
    ],
    antiPatterns: () => [
      "No usar 'use client' en componentes que pueden ser Server Components.",
      "No hacer fetch de datos en componentes cliente cuando un Server Component puede hacerlo.",
      "No importar modulos de servidor (fs, db) en componentes cliente.",
    ],
  },
  {
    slugs: ["nextjs-pages"],
    cognitiveLevel: "navigator",
    complexityTier: 2,
    title: () => "Next.js Pages Router como framework frontend",
    decision: (d) => `El frontend utiliza Next.js ${(d.metadata.version as string) ?? ""} con Pages Router.`.trim(),
    mechanism: () => "Pages Router con getServerSideProps/getStaticProps para data-fetching. Rutas basadas en la estructura de pages/.",
    rationale: () => "Pages Router es el modelo estable y probado de Next.js. El proyecto ya esta estructurado con este patron.",
    alternatives: () => [
      { option: "App Router", rejectedBecause: "Requiere migracion significativa del codebase existente." },
    ],
    antiPatterns: () => [
      "No mezclar patrones de App Router (server components) con Pages Router.",
      "No hacer fetching de datos en el cliente si getServerSideProps puede proveerlos.",
    ],
  },
  {
    slugs: ["express"],
    cognitiveLevel: "navigator",
    complexityTier: 1,
    title: () => "Express.js como servidor HTTP",
    decision: () => "El backend utiliza Express.js como servidor HTTP principal.",
    mechanism: () => "Middlewares encadenados para request processing. Rutas definidas con app.get/post/etc. Error handling centralizado.",
    rationale: () => "Express es el framework HTTP mas adoptado en Node.js. Ecosistema maduro de middlewares y amplia documentacion.",
    alternatives: () => [
      { option: "Fastify", rejectedBecause: "Menor base de middlewares existentes." },
      { option: "Hono", rejectedBecause: "Framework mas nuevo con menor adopcion." },
    ],
    antiPatterns: () => [
      "No manejar errores async sin try-catch o middleware de error.",
      "No almacenar estado mutable en variables globales del servidor.",
    ],
  },
  {
    slugs: ["postgresql-prisma"],
    cognitiveLevel: "anchor",
    complexityTier: 2,
    title: () => "PostgreSQL via Prisma ORM como persistencia relacional",
    decision: () => "La persistencia relacional utiliza PostgreSQL con Prisma ORM para type-safety y migraciones.",
    mechanism: () => "Prisma schema en prisma/schema.prisma define los modelos. Migraciones via prisma migrate. Cliente generado provee queries type-safe.",
    rationale: () => "Prisma genera tipos TypeScript desde el schema, eliminando divergencia entre modelo de datos y codigo. Las migraciones son declarativas y reproducibles.",
    alternatives: () => [
      { option: "Drizzle ORM", rejectedBecause: "Menor madurez en tooling de migraciones." },
      { option: "TypeORM", rejectedBecause: "Decoradores y patrones Active Record anaden complejidad." },
      { option: "SQL crudo", rejectedBecause: "Sin type-safety; propenso a errores en queries complejas." },
    ],
    antiPatterns: () => [
      "No ejecutar queries SQL crudas fuera de Prisma si el ORM lo soporta.",
      "No modificar el schema de la DB sin crear una migracion.",
      "No ignorar las validaciones de tipos generados por Prisma.",
    ],
  },
  {
    slugs: ["postgresql-drizzle", "sql-drizzle"],
    cognitiveLevel: "anchor",
    complexityTier: 2,
    title: () => "PostgreSQL via Drizzle ORM",
    decision: () => "La persistencia utiliza Drizzle ORM para queries SQL type-safe con control granular.",
    mechanism: () => "Schema definido en TypeScript con drizzle-kit para migraciones. Queries builder type-safe sin magic strings.",
    rationale: () => "Drizzle ofrece control SQL granular con type-safety completo. Menor overhead que ORMs tradicionales.",
    alternatives: () => [
      { option: "Prisma", rejectedBecause: "Mayor abstraccion que puede ocultar queries ineficientes." },
    ],
    antiPatterns: () => [
      "No mezclar queries raw SQL con el query builder de Drizzle.",
      "No modificar tablas sin generar migraciones con drizzle-kit.",
    ],
  },
  {
    slugs: ["mongodb-mongoose"],
    cognitiveLevel: "anchor",
    complexityTier: 2,
    title: () => "MongoDB via Mongoose como persistencia documental",
    decision: () => "La persistencia utiliza MongoDB con Mongoose para modelado de documentos.",
    mechanism: () => "Schemas de Mongoose definen la estructura de documentos. Validacion en la capa de aplicacion. Indices definidos en el schema.",
    rationale: () => "MongoDB permite esquemas flexibles para datos no-relacionales. Mongoose agrega validacion y tipado sobre la API nativa.",
    alternatives: () => [
      { option: "PostgreSQL", rejectedBecause: "Requiere esquema rigido para datos con estructura variable." },
    ],
    antiPatterns: () => [
      "No almacenar relaciones complejas que requieren joins frecuentes.",
      "No omitir indices en campos usados en queries frecuentes.",
    ],
  },
  {
    slugs: ["sqlite-bettersqlite3"],
    cognitiveLevel: "anchor",
    complexityTier: 1,
    title: () => "SQLite via better-sqlite3 como persistencia local",
    decision: () => "La persistencia utiliza SQLite con better-sqlite3 para almacenamiento local sin servidor.",
    mechanism: () => "Base de datos en un unico archivo. Queries sincronas via better-sqlite3. WAL mode para lecturas concurrentes.",
    rationale: () => "SQLite elimina la necesidad de un servidor de base de datos externo. Ideal para aplicaciones local-first y embebidas.",
    alternatives: () => [
      { option: "PostgreSQL", rejectedBecause: "Requiere servidor externo; over-engineering para uso local." },
    ],
    antiPatterns: () => [
      "No abrir multiples conexiones de escritura concurrentes.",
      "No usar SQLite para cargas de escritura masivas concurrentes.",
    ],
  },
  {
    slugs: ["mysql-prisma"],
    cognitiveLevel: "anchor",
    complexityTier: 2,
    title: () => "MySQL via Prisma ORM como persistencia relacional",
    decision: () => "La persistencia relacional utiliza MySQL con Prisma ORM.",
    mechanism: () => "Prisma schema define los modelos con provider mysql. Migraciones via prisma migrate.",
    rationale: () => "MySQL es un motor relacional maduro y ampliamente soportado. Prisma agrega type-safety y migraciones declarativas.",
    alternatives: () => [
      { option: "PostgreSQL", rejectedBecause: "Proyecto ya configurado con MySQL." },
    ],
    antiPatterns: () => [
      "No ejecutar queries crudas fuera de Prisma.",
      "No modificar el schema sin generar migraciones.",
    ],
  },
  {
    slugs: ["turborepo"],
    cognitiveLevel: "navigator",
    complexityTier: 2,
    title: () => "Turborepo como orquestador de monorepo",
    decision: () => "El monorepo utiliza Turborepo para orquestacion de builds, tests y tareas.",
    mechanism: () => "turbo.json define el pipeline de tareas con dependsOn y cache. Cada paquete declara sus scripts en package.json.",
    rationale: () => "Turborepo provee caching incremental y ejecucion paralela. Reduce tiempos de build significativamente en monorepos.",
    alternatives: () => [
      { option: "Nx", rejectedBecause: "Mayor complejidad de configuracion para proyectos medianos." },
      { option: "Lerna", rejectedBecause: "Menor rendimiento sin caching nativo." },
    ],
    antiPatterns: () => [
      "No saltarse el pipeline de Turbo ejecutando scripts directamente en paquetes interdependientes.",
      "No ignorar los outputs de cache en turbo.json.",
    ],
  },
  {
    slugs: ["fastapi"],
    cognitiveLevel: "navigator",
    complexityTier: 2,
    title: () => "FastAPI como framework backend",
    decision: () => "El backend utiliza FastAPI para servir la API HTTP con validacion automatica y documentacion OpenAPI.",
    mechanism: () => "Endpoints async definidos con decoradores. Pydantic para validacion de request/response. Uvicorn como servidor ASGI.",
    rationale: () => "FastAPI combina rendimiento async con type-safety via Pydantic y genera documentacion OpenAPI automaticamente.",
    alternatives: () => [
      { option: "Django REST Framework", rejectedBecause: "Mayor overhead para APIs puras sin necesidad de ORM integrado." },
      { option: "Flask", rejectedBecause: "Sin validacion nativa ni soporte async." },
    ],
    antiPatterns: () => [
      "No usar funciones sincronas bloqueantes en endpoints async.",
      "No omitir modelos Pydantic para validacion de entrada.",
      "No exponer excepciones internas sin un exception handler.",
    ],
  },
  {
    slugs: ["django"],
    cognitiveLevel: "navigator",
    complexityTier: 2,
    title: () => "Django como framework backend",
    decision: () => "El backend utiliza Django como framework web full-stack.",
    mechanism: () => "Models definen el esquema de datos. Views procesan requests. URLs mapean rutas. Migraciones via manage.py migrate.",
    rationale: () => "Django provee ORM, auth, admin y migraciones out-of-the-box. Ideal para aplicaciones con modelo de datos relacional complejo.",
    alternatives: () => [
      { option: "FastAPI", rejectedBecause: "No incluye ORM ni admin panel integrados." },
    ],
    antiPatterns: () => [
      "No ejecutar queries N+1 en views sin select_related/prefetch_related.",
      "No modificar modelos sin crear migraciones.",
    ],
  },
  {
    slugs: ["flask"],
    cognitiveLevel: "explorer",
    complexityTier: 1,
    title: () => "Flask como framework backend",
    decision: () => "El backend utiliza Flask como micro-framework HTTP.",
    mechanism: () => "Rutas definidas con decoradores. Blueprints para modularizar. Extensions para funcionalidad adicional.",
    rationale: () => "Flask es minimalista y flexible. Permite elegir cada componente (ORM, auth, etc.) independientemente.",
    alternatives: () => [
      { option: "FastAPI", rejectedBecause: "Mayor complejidad inicial para APIs simples." },
    ],
    antiPatterns: () => [
      "No almacenar estado mutable en variables globales del modulo.",
      "No omitir manejo de errores en endpoints.",
    ],
  },
  {
    slugs: ["langchain"],
    cognitiveLevel: "anchor",
    complexityTier: 3,
    title: () => "LangChain/LangGraph como framework de agentes AI",
    decision: () => "La orquestacion de agentes AI utiliza LangChain y/o LangGraph para flujos multi-paso con LLMs.",
    mechanism: () => "LangGraph define grafos de estado con nodos y edges. Cada nodo ejecuta una accion (tool call, LLM call). El estado se propaga entre nodos.",
    rationale: () => "LangGraph permite flujos de agentes complejos con ciclos, branching y estado persistente. LangChain provee abstracciones para tools, memory y prompts.",
    alternatives: () => [
      { option: "Llamadas directas a la API del LLM", rejectedBecause: "Sin soporte para grafos de estado, reintentos ni tool calling estandarizado." },
      { option: "CrewAI", rejectedBecause: "Menor control sobre el flujo de ejecucion." },
    ],
    antiPatterns: () => [
      "No hardcodear prompts sin versionarlos o parametrizarlos.",
      "No omitir manejo de errores en tool calls (timeouts, rate limits).",
      "No ignorar el costo de tokens en flujos con multiples LLM calls.",
    ],
  },
  {
    slugs: ["sqlalchemy"],
    cognitiveLevel: "anchor",
    complexityTier: 2,
    title: () => "SQLAlchemy como ORM Python",
    decision: () => "La persistencia utiliza SQLAlchemy para modelado relacional con type-safety.",
    mechanism: () => "Modelos declarativos con Column definitions. Sessions para transacciones. Alembic para migraciones.",
    rationale: () => "SQLAlchemy es el ORM mas maduro de Python. Soporta multiples backends SQL y ofrece tanto ORM como Core para queries.",
    alternatives: () => [
      { option: "Django ORM", rejectedBecause: "Acoplado al framework Django." },
    ],
    antiPatterns: () => [
      "No crear sesiones sin cerrarlas (usar context manager).",
      "No ejecutar queries en loops sin batch/bulk operations.",
    ],
  },
  {
    slugs: ["supabase"],
    cognitiveLevel: "anchor",
    complexityTier: 2,
    title: () => "Supabase como backend-as-a-service",
    decision: () => "La persistencia y autenticacion utilizan Supabase (PostgreSQL + Auth + Storage + Realtime).",
    mechanism: () => "Cliente Supabase conecta a PostgreSQL via REST/Realtime. Auth con JWT. Storage para archivos. Row Level Security para autorizacion.",
    rationale: () => "Supabase provee PostgreSQL managed con auth, storage y realtime integrados. Reduce la necesidad de infraestructura propia.",
    alternatives: () => [
      { option: "Firebase", rejectedBecause: "NoSQL (Firestore) vs SQL (PostgreSQL); vendor lock-in mas fuerte." },
      { option: "PostgreSQL autohosteado", rejectedBecause: "Requiere mantener infraestructura de auth, storage y realtime por separado." },
    ],
    antiPatterns: () => [
      "No omitir Row Level Security en tablas con datos de usuario.",
      "No exponer la service_role key en el frontend.",
      "No hacer queries complejas sin indices en las columnas filtradas.",
    ],
  },
  {
    slugs: ["pytest"],
    cognitiveLevel: "explorer",
    complexityTier: 1,
    title: () => "pytest como framework de testing",
    decision: () => "Los tests del proyecto Python utilizan pytest.",
    mechanism: () => "Tests como funciones con prefijo test_. Fixtures para setup/teardown. Markers para categorizar. conftest.py para configuracion compartida.",
    rationale: () => "pytest es el standard de facto en Python. Fixtures, parametrize y plugins lo hacen extensible sin boilerplate.",
    alternatives: () => [
      { option: "unittest", rejectedBecause: "Requiere clases y mas boilerplate." },
    ],
    antiPatterns: () => [
      "No compartir estado mutable entre tests sin fixtures con scope adecuado.",
      "No omitir fixtures de limpieza para recursos externos (DB, files).",
    ],
  },
  {
    slugs: ["python"],
    cognitiveLevel: "explorer",
    complexityTier: 1,
    title: () => "Python como runtime del backend",
    decision: () => "El proyecto utiliza Python como lenguaje principal del backend.",
    mechanism: () => "Entorno virtual para aislamiento de dependencias. pip/poetry/uv para gestion de paquetes.",
    rationale: () => "Python tiene el ecosistema mas amplio para AI/ML, data processing y APIs web.",
    alternatives: () => [
      { option: "Node.js", rejectedBecause: "Menor ecosistema de librerias AI/ML nativas." },
      { option: "Go", rejectedBecause: "Menor productividad para prototipado rapido." },
    ],
    antiPatterns: () => [
      "No instalar paquetes fuera del entorno virtual.",
      "No commitear el entorno virtual (venv/) al repositorio.",
    ],
  },
  {
    slugs: ["golang"],
    cognitiveLevel: "explorer",
    complexityTier: 1,
    title: () => "Go como runtime principal",
    decision: () => "El proyecto utiliza Go como lenguaje de desarrollo.",
    mechanism: () => "Go modules para gestion de dependencias. go build para compilacion. go test para testing.",
    rationale: () => "Go ofrece compilacion rapida, binarios estaticos y concurrencia nativa con goroutines.",
    alternatives: () => [
      { option: "Rust", rejectedBecause: "Curva de aprendizaje mas pronunciada." },
      { option: "Node.js", rejectedBecause: "Menor rendimiento en workloads CPU-bound." },
    ],
    antiPatterns: () => [
      "No ignorar errores retornados (no usar _ sin justificacion).",
      "No compartir estado mutable entre goroutines sin sincronizacion.",
    ],
  },
  {
    slugs: ["rust"],
    cognitiveLevel: "navigator",
    complexityTier: 2,
    title: () => "Rust como runtime principal",
    decision: () => "El proyecto utiliza Rust para rendimiento y seguridad de memoria.",
    mechanism: () => "Cargo para build y dependencias. Ownership system para seguridad de memoria sin GC. Crates.io como registry.",
    rationale: () => "Rust garantiza seguridad de memoria en compile-time sin garbage collector. Ideal para sistemas de alto rendimiento.",
    alternatives: () => [
      { option: "C++", rejectedBecause: "Sin garantias de seguridad de memoria en compile-time." },
      { option: "Go", rejectedBecause: "GC introduce latencia impredecible." },
    ],
    antiPatterns: () => [
      "No usar unsafe sin documentar la invariante de seguridad.",
      "No ignorar warnings del compilador.",
    ],
  },
  {
    slugs: ["docker"],
    cognitiveLevel: "explorer",
    complexityTier: 1,
    title: () => "Docker como entorno de containerizacion",
    decision: () => "El proyecto utiliza Docker para empaquetar y desplegar la aplicacion.",
    mechanism: () => "Dockerfile define la imagen. Multi-stage builds para optimizar tamano. .dockerignore para excluir archivos innecesarios.",
    rationale: () => "Docker garantiza reproducibilidad del entorno entre desarrollo y produccion.",
    alternatives: () => [
      { option: "Despliegue directo", rejectedBecause: "Sin aislamiento ni reproducibilidad del entorno." },
    ],
    antiPatterns: () => [
      "No instalar dependencias de desarrollo en la imagen de produccion.",
      "No correr el proceso como root en el contenedor.",
    ],
  },
];

export function getTemplate(detection: Detection): EdeTemplate | null {
  return TEMPLATES.find((t) => t.slugs.includes(detection.slug)) ?? null;
}

export { type EdeTemplate };
