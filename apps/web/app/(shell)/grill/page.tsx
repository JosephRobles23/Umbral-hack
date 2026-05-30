import type { Ede } from "@umbral/contracts";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { PageHead } from "@/components/ui/page-head";
import { GrillStarter } from "./GrillStarter";

async function getEdes(): Promise<Ede[]> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getAll();
}

export default async function GrillPage() {
  const edes = await getEdes();

  return (
    <ContentWrapper>
      <div className="animate-page-in">
        <PageHead
          title="Grill Me"
          sub="Sesión de alineación — la IA interroga antes de permitir diseño"
        />
        <GrillStarter edes={edes} />
      </div>
    </ContentWrapper>
  );
}
