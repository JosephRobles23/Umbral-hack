import type { LayerContract, LayerContractResult } from "@umbral/contracts";

export function verifyContract(contract: LayerContract): LayerContractResult {
  const violations: LayerContractResult["violations"] = [];

  for (const inv of contract.invariants) {
    if (!inv.check()) {
      violations.push({ invariantId: inv.id, description: inv.description });
    }
  }

  return {
    contractId: contract.id,
    pass: violations.length === 0,
    violations,
  };
}

export function verifyAllContracts(contracts: LayerContract[]): LayerContractResult[] {
  const results = contracts.map(verifyContract);
  const failures = results.filter((r) => !r.pass);

  if (failures.length > 0) {
    const details = failures
      .flatMap((f) =>
        f.violations.map((v) => `  ${f.contractId}/${v.invariantId}: ${v.description}`),
      )
      .join("\n");
    throw new Error(`[S13] LayerContract violations:\n${details}`);
  }

  return results;
}
