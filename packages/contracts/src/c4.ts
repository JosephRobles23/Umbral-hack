import type { C4Layer } from "./doc-regen";

export type { C4Layer };

export interface C4Element {
  id: string;
  name: string;
  description: string;
  layer: C4Layer;
  technology?: string;
  relationships: C4Relationship[];
}

export interface C4Relationship {
  targetId: string;
  description: string;
}

export interface C4Model {
  elements: C4Element[];
  lastUpdated: string;
}

export interface C4RegenTrigger {
  affectedLayers: C4Layer[];
  model: C4Model;
  timestamp: string;
}
