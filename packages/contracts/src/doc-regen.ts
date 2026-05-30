export interface DocNode {
  id: string;
  path: string;
  layer: "L1" | "L2" | "L3" | "L4" | "L5";
  subsystem: string;
  content: string;
  dependsOn: string[];
}

export interface ChangeDiff {
  kind: "file_change" | "ede_update" | "dependency_change";
  affectedPaths: string[];
  size: number;
}

export interface CouplingWarning {
  ratio: number;
  scopeSize: number;
  totalSize: number;
  message: string;
}

export interface DocRegenEvent {
  trigger: ChangeDiff["kind"];
  scope: DocNode[];
  diff: ChangeDiff;
  affectedC4Layers: C4Layer[];
  couplingWarning: CouplingWarning | null;
}

export type C4Layer = "system" | "container" | "component" | "code";

export type DocRegenSubscriber = (event: DocRegenEvent) => void;
