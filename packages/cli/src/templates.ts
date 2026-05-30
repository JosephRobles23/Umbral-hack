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
];

export function getTemplate(detection: Detection): EdeTemplate | null {
  return TEMPLATES.find((t) => t.slugs.includes(detection.slug)) ?? null;
}

export { type EdeTemplate };
