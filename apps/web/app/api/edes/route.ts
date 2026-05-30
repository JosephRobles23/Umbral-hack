import { NextResponse } from "next/server";
import { getEdeStore } from "@/lib/db";
import { loadEde } from "@umbral/persistence";

export function GET() {
  const store = getEdeStore();
  return NextResponse.json(store.getAll());
}

export async function POST(request: Request) {
  const body = await request.json();
  const ede = loadEde(body);
  const store = getEdeStore();
  store.save(ede);
  return NextResponse.json(ede, { status: 201 });
}
