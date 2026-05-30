export interface Invariant {
  id: string;
  description: string;
  layer: string;
  check: () => boolean;
}

export interface LayerContract {
  id: string;
  fromLayer: string;
  toLayer: string;
  invariants: Invariant[];
  verifiedBy: string[];
}

export interface LayerContractResult {
  contractId: string;
  pass: boolean;
  violations: { invariantId: string; description: string }[];
}
