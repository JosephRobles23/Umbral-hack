import type { Ede } from "@umbral/contracts";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { PageHead } from "@/components/ui/page-head";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CompactC4 } from "@/components/dashboard/compact-c4";
import { RecentActivity } from "@/components/dashboard/recent-activity";

async function getEdes(): Promise<Ede[]> {
  const { getEdeStore } = await import("@/lib/db");
  return getEdeStore().getAll();
}

export default async function DashboardPage() {
  const edes = await getEdes();
  const accepted = edes.filter((e) => e.status === "accepted").length;

  return (
    <ContentWrapper>
      <div className="animate-page-in">
        <PageHead
          title="Dashboard"
          sub="Panorama de gobernanza del proyecto"
        />

        <div className="grid grid-cols-3 gap-5 mb-8">
          <MetricCard
            label="Puntuación CDR"
            value="0.15"
            mono
            trend="tendencia a la baja"
            trendDir="good"
            progress={15}
            progressColor="#2D7D46"
          />
          <MetricCard
            label="EDEs activas"
            value={accepted}
            trend={`${edes.length} total`}
            trendDir="good"
          />
          <MetricCard
            label="Estado de gates"
            value="3/3"
            mono
            trend="todos pasan"
            trendDir="good"
            progress={100}
            progressColor="#2D7D46"
          />
        </div>

        <div className="mb-7">
          <CompactC4 />
        </div>

        <div className="mb-7">
          <h2 className="text-lg font-semibold leading-6 mb-3">
            Actividad reciente
          </h2>
          <RecentActivity />
        </div>
      </div>
    </ContentWrapper>
  );
}
