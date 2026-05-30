import { describe, it, expect, vi } from "vitest";
import type { DocNode, ChangeDiff, DocRegenEvent } from "@umbral/contracts";
import {
  computeMinimalScope,
  flagCoupling,
  onChange,
  SUSPICIOUS_RATIO,
} from "./doc-regen";

const makeNode = (
  id: string,
  path: string,
  layer: DocNode["layer"] = "L1",
  dependsOn: string[] = [],
): DocNode => ({
  id,
  path,
  layer,
  subsystem: "S2",
  content: `Node ${id}`,
  dependsOn,
});

const NODES: DocNode[] = [
  makeNode("n1", "packages/persistence/src/db.ts", "L1"),
  makeNode("n2", "packages/orchestrator/src/grill.ts", "L3"),
  makeNode("n3", "apps/web/app/api/edes/route.ts", "L4"),
  makeNode("n4", "packages/contracts/src/ede.ts", "L2", [
    "packages/persistence/src/db.ts",
  ]),
];

describe("computeMinimalScope", () => {
  it("retorna solo nodos cuyo path coincide con el diff", () => {
    const diff: ChangeDiff = {
      kind: "file_change",
      affectedPaths: ["packages/orchestrator/src/grill.ts"],
      size: 1,
    };
    const scope = computeMinimalScope(diff, NODES);
    expect(scope).toHaveLength(1);
    expect(scope[0].id).toBe("n2");
  });

  it("incluye nodos que dependen de paths afectados", () => {
    const diff: ChangeDiff = {
      kind: "file_change",
      affectedPaths: ["packages/persistence/src/db.ts"],
      size: 1,
    };
    const scope = computeMinimalScope(diff, NODES);
    expect(scope).toHaveLength(2);
    const ids = scope.map((n) => n.id);
    expect(ids).toContain("n1");
    expect(ids).toContain("n4");
  });

  it("retorna vacío si ningún nodo coincide", () => {
    const diff: ChangeDiff = {
      kind: "file_change",
      affectedPaths: ["nonexistent/file.ts"],
      size: 1,
    };
    expect(computeMinimalScope(diff, NODES)).toHaveLength(0);
  });
});

describe("flagCoupling", () => {
  it("marca scope desproporcionado al total", () => {
    const bigScope = NODES.slice(0, 3);
    const warning = flagCoupling(bigScope, 4);
    expect(warning).not.toBeNull();
    expect(warning!.ratio).toBe(0.75);
    expect(warning!.message).toContain("Acoplamiento excesivo");
  });

  it("no marca scope proporcional", () => {
    const smallScope = NODES.slice(0, 1);
    expect(flagCoupling(smallScope, 4)).toBeNull();
  });

  it("SUSPICIOUS_RATIO es 0.5", () => {
    expect(SUSPICIOUS_RATIO).toBe(0.5);
  });
});

describe("onChange", () => {
  it("todos los suscriptores reciben el mismo evento", () => {
    const sub1 = vi.fn();
    const sub2 = vi.fn();
    const diff: ChangeDiff = {
      kind: "file_change",
      affectedPaths: ["packages/persistence/src/db.ts"],
      size: 1,
    };

    const event = onChange(diff, NODES, [sub1, sub2]);

    expect(sub1).toHaveBeenCalledOnce();
    expect(sub2).toHaveBeenCalledOnce();
    expect(sub1.mock.calls[0][0]).toBe(event);
    expect(sub2.mock.calls[0][0]).toBe(event);
  });

  it("evento contiene scope mínimo y capas C4 afectadas", () => {
    const diff: ChangeDiff = {
      kind: "ede_update",
      affectedPaths: ["packages/orchestrator/src/grill.ts"],
      size: 1,
    };

    const event: DocRegenEvent = onChange(diff, NODES, []);

    expect(event.trigger).toBe("ede_update");
    expect(event.scope).toHaveLength(1);
    expect(event.scope[0].id).toBe("n2");
    expect(event.affectedC4Layers).toContain("component");
  });
});
