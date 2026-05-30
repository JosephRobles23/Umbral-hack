"use client";

import { useState } from "react";
import type { Ede } from "@umbral/contracts";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import { Tabs, Badge, Progress } from "@/components/ui";

const DETAIL_TABS = [
  { id: "decision", label: "Decisión" },
  { id: "contracts", label: "Contratos" },
  { id: "tests", label: "Pruebas" },
  { id: "history", label: "Historial" },
];

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-text-tertiary mb-1">{label}</div>
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-bg-elevated rounded-lg p-5 shadow-sm">
      {children}
    </div>
  );
}

function DecisionTab({ ede }: { ede: Ede }) {
  return (
    <div>
      <div className="mb-7">
        <h3 className="text-base font-semibold mb-3">Qué y cómo</h3>
        <InfoCard>
          <FieldRow label="Decisión">{ede.whatAndHow.decision}</FieldRow>
          <FieldRow label="Mecanismo">{ede.whatAndHow.mechanism}</FieldRow>
        </InfoCard>
      </div>
      <div className="mb-7">
        <h3 className="text-base font-semibold mb-3">Por qué</h3>
        <InfoCard>
          <FieldRow label="Justificación">{ede.why.rationale}</FieldRow>
          <FieldRow label="Alternativas consideradas">
            {ede.why.alternativesConsidered.map((a, i) => (
              <span key={i} className="block text-sm">
                <strong>{a.option}</strong>: {a.rejectedBecause}
              </span>
            ))}
          </FieldRow>
          {ede.why.references.length > 0 && (
            <div>
              <div className="text-xs font-medium text-text-tertiary mb-1.5">Referencias</div>
              <div className="flex flex-wrap gap-2">
                {ede.why.references.map((r, i) => (
                  <Badge key={i} variant="neutral">{r}</Badge>
                ))}
              </div>
            </div>
          )}
        </InfoCard>
      </div>
      {ede.whatNotToDo.antiPatterns.length > 0 && (
        <div className="mb-7">
          <h3 className="text-base font-semibold mb-3">
            Anti-patrones{" "}
            <span className="text-text-tertiary font-normal text-[13px]">(PROHIBIDO)</span>
          </h3>
          <div className="bg-error-subtle border border-error rounded-lg overflow-hidden">
            {ede.whatNotToDo.antiPatterns.map((ap, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3.5 ${
                  i < ede.whatNotToDo.antiPatterns.length - 1
                    ? "border-b border-error/20"
                    : ""
                }`}
              >
                <span className="text-error inline-flex shrink-0 mt-0.5">
                  <X size={16} />
                </span>
                <span className="text-sm text-text-primary">{ap}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContractsTab({ ede }: { ede: Ede }) {
  return (
    <div>
      <div className="mb-7">
        <h3 className="text-base font-semibold mb-3">Contratos entre capas</h3>
        <div className="bg-bg-card border border-bg-elevated rounded-lg overflow-hidden shadow-sm">
          {ede.contracts.layerContracts.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                i < ede.contracts.layerContracts.length - 1
                  ? "border-b border-bg-elevated"
                  : ""
              }`}
            >
              <span className="font-mono text-xs bg-bg-base border border-bg-elevated rounded-md px-2 py-0.5 shrink-0">
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>
      {ede.contracts.verifiedBy.length > 0 && (
        <div className="mb-7">
          <h3 className="text-base font-semibold mb-3">Verificado por</h3>
          <InfoCard>
            <ul className="m-0 pl-4 flex flex-col gap-2">
              {ede.contracts.verifiedBy.map((v, i) => (
                <li key={i} className="text-sm text-text-secondary">{v}</li>
              ))}
            </ul>
          </InfoCard>
        </div>
      )}
    </div>
  );
}

function TestsTab({ ede }: { ede: Ede }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-7">
        <div>
          <h3 className="text-base font-semibold mb-3">Pruebas unitarias</h3>
          <div className="bg-bg-card border border-bg-elevated rounded-lg overflow-hidden shadow-sm">
            {ede.tests.unitTests.map((u, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < ede.tests.unitTests.length - 1
                    ? "border-b border-bg-elevated"
                    : ""
                }`}
              >
                <span className="text-success inline-flex shrink-0">
                  <CheckCircle size={16} />
                </span>
                <span className="text-sm">{u}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-3">Caminos tristes</h3>
          <div className="bg-bg-card border border-bg-elevated rounded-lg overflow-hidden shadow-sm">
            {ede.tests.sadPaths.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < ede.tests.sadPaths.length - 1
                    ? "border-b border-bg-elevated"
                    : ""
                }`}
              >
                <span className="text-warning inline-flex shrink-0">
                  <AlertTriangle size={16} />
                </span>
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-7">
        <h3 className="text-base font-semibold mb-3">Cobertura objetivo</h3>
        <InfoCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Cobertura objetivo</span>
            <span className="font-mono text-xs text-success">
              {(ede.tests.coverageTarget * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={ede.tests.coverageTarget * 100} />
        </InfoCard>
      </div>
    </div>
  );
}

function HistoryTab({ ede }: { ede: Ede }) {
  const p = ede.provenance;
  return (
    <div className="mb-7">
      <h3 className="text-base font-semibold mb-3">Procedencia</h3>
      <InfoCard>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Fase">{p.phase}</FieldRow>
          <FieldRow label="Slice">
            <span className="font-mono text-xs">{p.slice}</span>
          </FieldRow>
          <FieldRow label="Creado por">
            <span className="font-mono text-xs">{p.createdBy}</span>
          </FieldRow>
          <FieldRow label="Versión actual">v{ede.version ?? 1}</FieldRow>
          <FieldRow label="Fecha de creación">{p.createdAt}</FieldRow>
          <FieldRow label="Última actualización">{p.lastUpdated}</FieldRow>
        </div>
      </InfoCard>
    </div>
  );
}

export function DetailTabs({ ede }: { ede: Ede }) {
  const [tab, setTab] = useState("decision");

  return (
    <>
      <Tabs tabs={DETAIL_TABS} active={tab} onChange={setTab} />
      <div className="animate-page-in" key={tab}>
        {tab === "decision" && <DecisionTab ede={ede} />}
        {tab === "contracts" && <ContractsTab ede={ede} />}
        {tab === "tests" && <TestsTab ede={ede} />}
        {tab === "history" && <HistoryTab ede={ede} />}
      </div>
    </>
  );
}
