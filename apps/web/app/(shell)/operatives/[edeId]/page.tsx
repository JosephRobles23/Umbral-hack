import Link from "next/link";
import type { Ede } from "@umbral/contracts";
import { ArrowLeft } from "lucide-react";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { ComplexityBadge, StatusBadge, Badge } from "@/components/ui";
import { DetailTabs } from "@/components/operatives/detail-tabs";

const LEVEL_LABEL: Record<string, string> = {
  explorer: "EXPLORER",
  navigator: "NAVIGATOR",
  anchor: "ANCHOR",
};

const LEVEL_COLOR: Record<string, string> = {
  explorer: "text-level-explorer",
  navigator: "text-level-navigator",
  anchor: "text-level-anchor",
};

async function getEde(id: string): Promise<Ede | null> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getById(id);
}

export default async function OperativeDetailPage({
  params,
}: {
  params: Promise<{ edeId: string }>;
}) {
  const { edeId } = await params;
  const ede = await getEde(edeId);

  if (!ede) {
    return (
      <ContentWrapper>
        <p className="text-text-tertiary">EDE no encontrada: {edeId}</p>
      </ContentWrapper>
    );
  }

  const level = ede.cognitiveLevel ?? "anchor";
  const tier = ede.complexityTier ?? 1;

  return (
    <ContentWrapper>
      <div className="animate-page-in">
        <Link
          href="/operatives"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary px-2 h-8 rounded-sm mb-4 no-underline transition-all duration-150"
        >
          <ArrowLeft size={14} /> Volver a Operativos
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <ComplexityBadge level={level} tier={tier} size={48} />
          <div className="flex-1">
            <div
              className={`text-[11px] tracking-[0.06em] uppercase font-semibold ${LEVEL_COLOR[level] ?? "text-accent"}`}
            >
              {LEVEL_LABEL[level] ?? level.toUpperCase()}
            </div>
            <h1 className="font-display text-2xl leading-[30px] tracking-[-0.02em] font-medium my-0.5">
              {ede.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-text-tertiary">
                {ede.id}
              </span>
              <StatusBadge status={ede.status} />
              <Badge variant="version">v{ede.version ?? 1}</Badge>
            </div>
          </div>
        </div>

        <DetailTabs ede={ede} />
      </div>
    </ContentWrapper>
  );
}
