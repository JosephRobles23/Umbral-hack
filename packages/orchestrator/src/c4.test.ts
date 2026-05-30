import { describe, it, expect } from "vitest";
import type { DocNode, C4Model, C4Layer } from "@umbral/contracts";
import { c4LayersFor, projectC4, reprojectC4 } from "./c4";

const makeNode = (
  id: string,
  layer: DocNode["layer"],
  dependsOn: string[] = [],
): DocNode => ({
  id,
  path: `packages/${id}.ts`,
  layer,
  subsystem: "S2",
  content: `Node ${id}`,
  dependsOn,
});

describe("c4LayersFor", () => {
  it("mapea capas de arquitectura a capas C4", () => {
    const nodes: DocNode[] = [makeNode("a", "L1"), makeNode("b", "L4")];
    const layers = c4LayersFor(nodes);
    expect(layers).toContain("code");
    expect(layers).toContain("container");
    expect(layers).toHaveLength(2);
  });

  it("deduplica capas", () => {
    const nodes: DocNode[] = [
      makeNode("a", "L2"),
      makeNode("b", "L3"),
    ];
    const layers = c4LayersFor(nodes);
    expect(layers).toEqual(["component"]);
  });
});

describe("projectC4", () => {
  it("genera un modelo C4 completo desde DocNodes", () => {
    const nodes: DocNode[] = [
      makeNode("db", "L1"),
      makeNode("api", "L4", ["db"]),
    ];
    const model = projectC4(nodes);
    expect(model.elements).toHaveLength(2);
    expect(model.elements[0].layer).toBe("code");
    expect(model.elements[1].layer).toBe("container");
    expect(model.elements[1].relationships).toHaveLength(1);
    expect(model.elements[1].relationships[0].targetId).toBe("db");
  });
});

describe("reprojectC4", () => {
  it("re-proyecta solo las capas afectadas, conserva el resto", () => {
    const initial: C4Model = {
      elements: [
        {
          id: "db",
          name: "db",
          description: "old desc",
          layer: "code",
          relationships: [],
        },
        {
          id: "api",
          name: "api",
          description: "API gateway",
          layer: "container",
          relationships: [],
        },
        {
          id: "ui",
          name: "ui",
          description: "Frontend",
          layer: "system",
          relationships: [],
        },
      ],
      lastUpdated: "2026-01-01T00:00:00Z",
    };

    const updatedNodes: DocNode[] = [
      makeNode("db-v2", "L1"),
    ];

    const affected: C4Layer[] = ["code"];
    const result = reprojectC4(initial, affected, updatedNodes);

    const codeElements = result.elements.filter((e) => e.layer === "code");
    expect(codeElements).toHaveLength(1);
    expect(codeElements[0].id).toBe("db-v2");

    const containerElements = result.elements.filter(
      (e) => e.layer === "container",
    );
    expect(containerElements).toHaveLength(1);
    expect(containerElements[0].id).toBe("api");

    const systemElements = result.elements.filter(
      (e) => e.layer === "system",
    );
    expect(systemElements).toHaveLength(1);
    expect(systemElements[0].id).toBe("ui");
  });

  it("no toca capas no afectadas aun con nodos en ellas", () => {
    const initial: C4Model = {
      elements: [
        {
          id: "comp1",
          name: "comp1",
          description: "Componente 1",
          layer: "component",
          relationships: [],
        },
      ],
      lastUpdated: "2026-01-01T00:00:00Z",
    };

    const updatedNodes: DocNode[] = [makeNode("new-code", "L1")];
    const result = reprojectC4(initial, ["code"], updatedNodes);

    const compElements = result.elements.filter(
      (e) => e.layer === "component",
    );
    expect(compElements).toHaveLength(1);
    expect(compElements[0].id).toBe("comp1");
  });
});
