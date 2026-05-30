export type CognitiveLevel = "explorer" | "navigator" | "anchor";
export type EdeStatus = "proposed" | "accepted" | "deprecated";
export type ComplexityTier = 1 | 2 | 3;

export interface Ede {
  id: string;
  title: string;
  version: number;
  status: EdeStatus;
  cognitiveLevel: CognitiveLevel;
  complexityTier: ComplexityTier;
  whatAndHow: { decision: string; mechanism: string };
  why: {
    rationale: string;
    alternativesConsidered: { option: string; rejectedBecause: string }[];
    references: string[];
  };
  whatNotToDo: { antiPatterns: string[] };
  whatsNext: { continuations: string[]; openQuestions: string[] };
  contracts: { layerContracts: string[]; verifiedBy: string[] };
  tests: {
    unitTests: string[];
    sadPaths: string[];
    coverageTarget: number;
  };
  provenance: {
    phase: string;
    slice: number | null;
    createdBy: string;
    createdAt: string | null;
    lastUpdated: string | null;
  };
}
