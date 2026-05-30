import { describe, it, expect } from "vitest";
import type { LayerContract } from "@umbral/contracts";
import { verifyContract, verifyAllContracts } from "./layers";

const makeContract = (
  id: string,
  invariants: { id: string; description: string; check: () => boolean }[],
): LayerContract => ({
  id,
  fromLayer: "L1",
  toLayer: "L2",
  invariants: invariants.map((inv) => ({ ...inv, layer: "L1" })),
  verifiedBy: ["test.ts"],
});

describe("verifyContract", () => {
  it("pasa cuando todas las invariantes se cumplen", () => {
    const contract = makeContract("C1", [
      { id: "inv-1", description: "siempre true", check: () => true },
      { id: "inv-2", description: "también true", check: () => true },
    ]);
    const result = verifyContract(contract);
    expect(result.pass).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("falla y reporta invariantes violadas", () => {
    const contract = makeContract("C2", [
      { id: "inv-ok", description: "ok", check: () => true },
      { id: "inv-fail", description: "esta falla", check: () => false },
    ]);
    const result = verifyContract(contract);
    expect(result.pass).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].invariantId).toBe("inv-fail");
  });
});

describe("verifyAllContracts", () => {
  it("pasa cuando todos los contratos se cumplen", () => {
    const contracts = [
      makeContract("C1", [{ id: "inv-1", description: "ok", check: () => true }]),
      makeContract("C2", [{ id: "inv-2", description: "ok", check: () => true }]),
    ];
    const results = verifyAllContracts(contracts);
    expect(results).toHaveLength(2);
    expect(results.every((r) => r.pass)).toBe(true);
  });

  it("lanza [S13] cuando un contrato se viola (fail-fast)", () => {
    const contracts = [
      makeContract("C-ok", [{ id: "inv-1", description: "ok", check: () => true }]),
      makeContract("C-fail", [
        { id: "inv-bad", description: "violación de capa", check: () => false },
      ]),
    ];
    expect(() => verifyAllContracts(contracts)).toThrow("[S13]");
    expect(() => verifyAllContracts(contracts)).toThrow("C-fail/inv-bad");
  });
});
