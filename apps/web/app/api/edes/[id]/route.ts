import { NextResponse } from "next/server";
import { getEdeStore } from "@/lib/db";

export function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return params.then(({ id }) => {
    const store = getEdeStore();
    const ede = store.getById(id);
    if (!ede) {
      return NextResponse.json({ error: "EDE not found" }, { status: 404 });
    }
    return NextResponse.json(ede);
  });
}
