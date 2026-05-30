const CLASSDEFS = `
  classDef ext fill:#EDE8DD,stroke:#9B9590,stroke-width:1.5px,color:#1A1A1A;
  classDef system fill:#E8EAFC,stroke:#6366F1,stroke-width:1.5px,color:#312E81;
  classDef container fill:#E0F2FE,stroke:#0EA5E9,stroke-width:1.5px,color:#075985;
  classDef component fill:#E7F8F1,stroke:#10B981,stroke-width:1.5px,color:#065F46;
  classDef code fill:#F5E6DE,stroke:#DA7756,stroke-width:1.5px,color:#9A4A2C;
  classDef db fill:#2C2B26,stroke:#1A1915,stroke-width:1.5px,color:#F5F0E8;
`;

export interface C4Diagram {
  id: string;
  label: string;
  desc: string;
  def: string;
}

export const C4_DIAGRAMS: C4Diagram[] = [
  {
    id: "capas",
    label: "Vista por capas",
    desc: "Las cuatro capas del modelo C4 y cómo se conectan, de la interfaz al código.",
    def: `flowchart TB
  usuario(["Usuario"]):::ext
  subgraph L5["L5 · Sistema"]
    direction LR
    frontend["frontend<br/><small>React 19</small>"]:::system
    api["api<br/><small>Next.js</small>"]:::system
  end
  subgraph L4["L4 · Contenedores"]
    direction LR
    bff["bff"]:::container
    worker["worker"]:::container
    sseHub["sse-hub"]:::container
  end
  subgraph L23["L2 / L3 · Componentes"]
    direction LR
    motor["motor-políticas"]:::component
    regen["regenerador-c4"]:::component
    indice["índice-fts"]:::component
    auth["auth"]:::component
  end
  subgraph L1["L1 · Código"]
    direction LR
    repo["repositorio"]:::code
    migr["migraciones"]:::code
    dsl["dsl-políticas"]:::code
  end
  db[("SQLite")]:::db
  usuario --> frontend
  frontend --> api
  api --> bff
  bff --> motor
  bff --> indice
  motor --> auth
  regen --> sseHub
  sseHub --> frontend
  worker --> repo
  motor --> repo
  indice --> repo
  auth --> repo
  migr --> repo
  repo --> db
  ${CLASSDEFS}`,
  },
  {
    id: "datos",
    label: "Flujo de datos",
    desc: "Recorrido de una petición del usuario hasta la base de datos y de vuelta.",
    def: `flowchart LR
  usuario(["Usuario"]):::ext --> frontend["frontend"]:::system
  frontend -->|"petición HTTP"| api["api"]:::system
  api --> bff["bff"]:::container
  bff -->|"evalúa reglas"| motor["motor-políticas"]:::component
  bff -->|"consulta"| indice["índice-fts"]:::component
  motor --> repo["repositorio"]:::code
  indice --> repo
  repo -->|"SQL tipado"| db[("SQLite")]:::db
  ${CLASSDEFS}`,
  },
  {
    id: "eventos",
    label: "Flujo de eventos",
    desc: "Cómo un cambio en un EDE regenera la documentación y llega al cliente vía SSE.",
    def: `flowchart LR
  ede["EDE actualizado"]:::component --> regen["regenerador-c4"]:::component
  regen -->|"reconstruye grafo"| sseHub["sse-hub"]:::container
  sseHub -->|"evento SSE"| frontend["frontend"]:::system
  frontend -->|"actualiza UI"| usuario(["Usuario"]):::ext
  worker["worker · cola"]:::container -.->|"encola job"| regen
  ${CLASSDEFS}`,
  },
];

export const C4_LEGEND = [
  { label: "Sistema (L5)", color: "#6366F1" },
  { label: "Contenedor (L4)", color: "#0EA5E9" },
  { label: "Componente (L2/L3)", color: "#10B981" },
  { label: "Código (L1)", color: "#DA7756" },
];
