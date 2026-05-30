import type { Ede, Policy } from "@umbral/contracts";

export function derivePoliciesFromEde(ede: Ede): Policy[] {
  return ede.whatNotToDo.antiPatterns.map((pattern, i) => ({
    id: `${ede.id}-anti-${i}`,
    name: `Anti-pattern: ${pattern.slice(0, 50)}`,
    description: pattern,
    rule: {
      subject: ede.id,
      condition: {
        field: "action.target",
        operator: "contains" as const,
        value: ede.id,
      },
      effect: "deny" as const,
    },
    sourceEdeId: ede.id,
  }));
}
