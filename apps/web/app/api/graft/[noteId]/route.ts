import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  try {
    const { noteId } = await params;
    const { isConnected, getNote } = await import("@umbral/graph");
    const connected = await isConnected();
    if (!connected) {
      return NextResponse.json({ error: "Neo4j not connected" }, { status: 503 });
    }
    const note = await getNote(noteId);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  try {
    const { noteId } = await params;
    const { isConnected, updateNote } = await import("@umbral/graph");
    const connected = await isConnected();
    if (!connected) {
      return NextResponse.json({ error: "Neo4j not connected" }, { status: 503 });
    }
    const body = await request.json();
    await updateNote(noteId, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ noteId: string }> },
) {
  try {
    const { noteId } = await params;
    const { isConnected, deleteNote } = await import("@umbral/graph");
    const connected = await isConnected();
    if (!connected) {
      return NextResponse.json({ error: "Neo4j not connected" }, { status: 503 });
    }
    await deleteNote(noteId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
