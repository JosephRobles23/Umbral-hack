"use client";

import { Badge } from "./badge";

const STATUS_MAP = {
  accepted: { label: "ACEPTADO", variant: "success" as const },
  proposed: { label: "PROPUESTO", variant: "info" as const },
  deprecated: { label: "OBSOLETO", variant: "neutral" as const },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.proposed;
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
