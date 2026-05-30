import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { isConnected, getGraph } = await import("@umbral/graph");
    const connected = await isConnected();
    if (!connected) {
      return NextResponse.json(
        { error: "Neo4j not connected. Run: docker compose up neo4j" },
        { status: 503 },
      );
    }
    const graph = await getGraph();
    return NextResponse.json(graph);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { isConnected, createNote } = await import("@umbral/graph");
    const connected = await isConnected();
    if (!connected) {
      return NextResponse.json(
        { error: "Neo4j not connected" },
        { status: 503 },
      );
    }
    const body = await request.json();
    await createNote(body);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
