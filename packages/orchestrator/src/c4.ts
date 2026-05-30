import type {
  DocNode,
  C4Layer,
  C4Element,
  C4Model,
} from "@umbral/contracts";

const LAYER_TO_C4: Record<DocNode["layer"], C4Layer> = {
  L1: "code",
  L2: "component",
  L3: "component",
  L4: "container",
  L5: "system",
};

export function c4LayersFor(scope: DocNode[]): C4Layer[] {
  const layers = new Set<C4Layer>();
  for (const node of scope) {
    layers.add(LAYER_TO_C4[node.layer]);
  }
  return Array.from(layers);
}

function nodeToElement(node: DocNode): C4Element {
  return {
    id: node.id,
    name: node.id,
    description: node.content,
    layer: LAYER_TO_C4[node.layer],
    technology: node.subsystem,
    relationships: node.dependsOn.map((dep) => ({
      targetId: dep,
      description: `depends on ${dep}`,
    })),
  };
}

export function projectC4(nodes: DocNode[]): C4Model {
  return {
    elements: nodes.map(nodeToElement),
    lastUpdated: new Date().toISOString(),
  };
}

export function reprojectC4(
  currentModel: C4Model,
  affectedLayers: C4Layer[],
  updatedNodes: DocNode[],
): C4Model {
  const affectedSet = new Set(affectedLayers);
  const untouched = currentModel.elements.filter(
    (el) => !affectedSet.has(el.layer),
  );
  const fresh = updatedNodes
    .filter((n) => affectedSet.has(LAYER_TO_C4[n.layer]))
    .map(nodeToElement);

  return {
    elements: [...untouched, ...fresh],
    lastUpdated: new Date().toISOString(),
  };
}
