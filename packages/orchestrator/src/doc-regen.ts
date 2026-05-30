import type {
  DocNode,
  ChangeDiff,
  DocRegenEvent,
  DocRegenSubscriber,
  CouplingWarning,
} from "@umbral/contracts";
import { c4LayersFor } from "./c4";

export const SUSPICIOUS_RATIO = 0.5;

export function computeMinimalScope(
  diff: ChangeDiff,
  allNodes: DocNode[],
): DocNode[] {
  return allNodes.filter((node) =>
    diff.affectedPaths.some(
      (path) =>
        node.path === path ||
        node.path.startsWith(path + "/") ||
        node.dependsOn.some((dep) => diff.affectedPaths.includes(dep)),
    ),
  );
}

export function flagCoupling(
  scope: DocNode[],
  total: number,
): CouplingWarning | null {
  if (total === 0) return null;
  const ratio = scope.length / total;
  if (ratio > SUSPICIOUS_RATIO) {
    return {
      ratio,
      scopeSize: scope.length,
      totalSize: total,
      message: `Acoplamiento excesivo: ${scope.length}/${total} nodos afectados (${(ratio * 100).toFixed(0)}%)`,
    };
  }
  return null;
}

export function onChange(
  diff: ChangeDiff,
  allNodes: DocNode[],
  subscribers: DocRegenSubscriber[],
): DocRegenEvent {
  const scope = computeMinimalScope(diff, allNodes);
  const couplingWarning = flagCoupling(scope, allNodes.length);
  const event: DocRegenEvent = {
    trigger: diff.kind,
    scope,
    diff,
    affectedC4Layers: c4LayersFor(scope),
    couplingWarning,
  };
  for (const sub of subscribers) {
    sub(event);
  }
  return event;
}
