import type { Ede } from "@umbral/contracts";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { PageHead } from "@/components/ui/page-head";
import { OperativesClient } from "@/components/operatives/operatives-client";

async function getEdes(): Promise<Ede[]> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getAll();
}

export default async function OperativesPage() {
  const edes = await getEdes();

  return (
    <ContentWrapper>
      <div className="animate-page-in">
        <PageHead
          title="Operativos"
          sub="Decisiones de Estructura Explícita (EDE)"
        />
        <OperativesClient edes={edes} />
      </div>
    </ContentWrapper>
  );
}
