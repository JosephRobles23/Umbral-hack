import { NextResponse } from "next/server";
import type {
  DocNode,
  ChangeDiff,
  C4RegenTrigger,
} from "@umbral/contracts";
import { onChange, projectC4 } from "@umbral/orchestrator";
import { broadcast } from "@/lib/sse";

const DOC_NODES: DocNode[] = [
  {
    id: "persistence",
    path: "packages/persistence",
    layer: "L1",
    subsystem: "S7",
    content: "SQLite persistence layer with FTS5 and sqlite-vec",
    dependsOn: [],
  },
  {
    id: "contracts",
    path: "packages/contracts",
    layer: "L2",
    subsystem: "S2",
    content: "Type contracts and interfaces shared across layers",
    dependsOn: [],
  },
  {
    id: "orchestrator",
    path: "packages/orchestrator",
    layer: "L3",
    subsystem: "S1",
    content: "Business logic: grill sessions, doc-regen, C4 projection",
    dependsOn: ["packages/persistence", "packages/contracts"],
  },
  {
    id: "api",
    path: "apps/web/app/api",
    layer: "L4",
    subsystem: "S6",
    content: "Next.js API routes — BFF layer",
    dependsOn: ["packages/orchestrator"],
  },
  {
    id: "frontend",
    path: "apps/web/app",
    layer: "L5",
    subsystem: "S6",
    content: "War Room UI — React Server Components + Client Components",
    dependsOn: ["apps/web/app/api"],
  },
];

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as { affectedPaths: string[]; kind?: ChangeDiff["kind"] };

  if (!body.affectedPaths || !Array.isArray(body.affectedPaths)) {
    return NextResponse.json(
      { error: "affectedPaths required" },
      { status: 400 },
    );
  }

  const diff: ChangeDiff = {
    kind: body.kind ?? "file_change",
    affectedPaths: body.affectedPaths,
    size: body.affectedPaths.length,
  };

  const event = onChange(diff, DOC_NODES, []);

  const model = projectC4(
    event.scope.length > 0 ? DOC_NODES : [],
  );

  const trigger: C4RegenTrigger = {
    affectedLayers: event.affectedC4Layers,
    model,
    timestamp: new Date().toISOString(),
  };

  broadcast(trigger);

  return NextResponse.json({
    event,
    trigger,
  });
}
