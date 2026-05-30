export interface BusinessPlan {
  id: string;
  retorno: string;
  moat: string;
  alineacionEstrategica: string;
  verdict: "go" | "no_go" | "pivot";
  rationale: string;
}

export interface TechnicalPlan {
  id: string;
  edeRefs: string[];
  layerContracts: string[];
  testStrategy: {
    unitTests: string[];
    sadPaths: string[];
    coverageTarget: number;
  };
  c4Snapshot: string;
  rationale: string;
}
