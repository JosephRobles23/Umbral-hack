import type { Ede } from "@umbral/contracts";
import Link from "next/link";
import { ShieldCheck, CheckCircle, XCircle, Ban, ExternalLink } from "lucide-react";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { PageHead } from "@/components/ui/page-head";
import { Badge } from "@/components/ui";

interface Policy {
  text: string;
  source: string;
}

interface PolicyGroup {
  key: string;
  title: string;
  icon: typeof CheckCircle;
  colorClass: string;
  bgClass: string;
  glyph: string;
  policies: Policy[];
}

async function derivePolicies(): Promise<PolicyGroup[]> {
  const { getEdeStore } = await import("@/lib/db");
  const edes: Ede[] = getEdeStore().getAll();
  const accepted = edes.filter((e) => e.status === "accepted");

  const allow: Policy[] = accepted.map((e) => ({
    text: e.whatAndHow.decision,
    source: e.id,
  }));

  const deny: Policy[] = accepted.flatMap((e) =>
    e.whatNotToDo.antiPatterns.map((ap) => ({
      text: ap,
      source: e.id,
    })),
  );

  const requireApproval: Policy[] = [];

  return [
    {
      key: "allow",
      title: "PERMITIR",
      icon: CheckCircle,
      colorClass: "text-success",
      bgClass: "bg-success-subtle",
      glyph: "●",
      policies: allow,
    },
    {
      key: "deny",
      title: "DENEGAR",
      icon: XCircle,
      colorClass: "text-error",
      bgClass: "bg-error-subtle",
      glyph: "✕",
      policies: deny,
    },
    {
      key: "require_approval",
      title: "REQUIERE APROBACIÓN",
      icon: Ban,
      colorClass: "text-warning",
      bgClass: "bg-warning-subtle",
      glyph: "⊘",
      policies: requireApproval,
    },
  ];
}

export default async function PoliciesPage() {
  const groups = await derivePolicies();
  const total = groups.reduce((acc, g) => acc + g.policies.length, 0);
  const sourceCount = new Set(groups.flatMap((g) => g.policies.map((p) => p.source))).size;

  return (
    <ContentWrapper>
      <div className="animate-page-in">
        <PageHead
          title="Políticas"
          sub="Políticas de gobernanza activas derivadas de los EDEs"
        />

        <div className="bg-bg-card border border-bg-elevated rounded-lg px-5 py-3.5 mb-6 flex items-center gap-2.5 shadow-sm">
          <span className="text-accent inline-flex">
            <ShieldCheck size={18} />
          </span>
          <span className="text-sm">
            <strong>{total} políticas activas</strong> derivadas de {sourceCount} EDEs
          </span>
        </div>

        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.key}
              className="bg-bg-card border border-bg-elevated rounded-lg mb-4 overflow-hidden shadow-sm"
            >
              <div
                className={`${g.bgClass} px-5 py-3 flex items-center gap-2`}
              >
                <span className={`${g.colorClass} inline-flex`}>
                  <Icon size={16} />
                </span>
                <span
                  className={`text-sm font-semibold tracking-[0.04em] ${g.colorClass}`}
                >
                  {g.title}
                </span>
                <Badge variant="neutral" className="ml-auto">
                  {g.policies.length}
                </Badge>
              </div>
              <div>
                {g.policies.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-text-tertiary">
                    Sin políticas en esta categoría
                  </div>
                ) : (
                  g.policies.map((p, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-5 py-3 ${
                        i < g.policies.length - 1 ? "border-b border-bg-elevated" : ""
                      }`}
                    >
                      <span
                        className={`${g.colorClass} w-[18px] shrink-0 text-center`}
                      >
                        {g.glyph}
                      </span>
                      <span className="text-sm flex-1 text-text-primary">
                        {p.text}
                      </span>
                      <Link
                        href={`/operatives/${p.source}`}
                        className="font-mono text-[11px] text-text-tertiary no-underline inline-flex items-center gap-1 hover:text-accent-text transition-colors"
                      >
                        {p.source} <ExternalLink size={12} />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ContentWrapper>
  );
}
