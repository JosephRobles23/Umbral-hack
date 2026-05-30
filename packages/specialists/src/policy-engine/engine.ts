import type {
  Policy,
  PolicyDecision,
  PolicyEffect,
  SystemAction,
  EvalContext,
  Condition,
} from "@umbral/contracts";

function matchesCondition(condition: Condition, action: SystemAction, ctx: EvalContext): boolean {
  const fieldValue = getFieldValue(condition.field, action, ctx);
  if (fieldValue === undefined) return false;

  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "not_equals":
      return fieldValue !== condition.value;
    case "contains":
      return fieldValue.includes(condition.value);
    case "matches":
      return new RegExp(condition.value).test(fieldValue);
  }
}

function getFieldValue(field: string, action: SystemAction, ctx: EvalContext): string | undefined {
  if (field === "action.type") return action.type;
  if (field === "action.target") return action.target;
  if (field === "actor") return ctx.actor;
  if (field === "environment") return ctx.environment;
  if (field.startsWith("metadata.") && action.metadata) {
    const key = field.slice("metadata.".length);
    const val = action.metadata[key];
    return typeof val === "string" ? val : undefined;
  }
  return undefined;
}

function resolveEffect(matched: Policy[]): PolicyEffect {
  if (matched.some((p) => p.rule.effect === "deny")) return "deny";
  if (matched.some((p) => p.rule.effect === "require_approval")) return "require_approval";
  return "allow";
}

function explain(matched: Policy[]): string {
  if (matched.length === 0) return "Ninguna política aplica; permitido por defecto.";
  return matched
    .map((p) => `[${p.id}] ${p.name}: ${p.rule.effect}`)
    .join("; ");
}

export function validatePolicy(policy: Policy): void {
  if (!policy.id || !policy.name) {
    throw new Error(`[S13] Política inválida: id y name requeridos.`);
  }
  if (!policy.rule?.condition?.field || !policy.rule?.condition?.operator) {
    throw new Error(`[S13] Política ${policy.id}: condición incompleta.`);
  }
  const validOps = ["equals", "not_equals", "contains", "matches"];
  if (!validOps.includes(policy.rule.condition.operator)) {
    throw new Error(`[S13] Política ${policy.id}: operador inválido "${policy.rule.condition.operator}".`);
  }
}

export function evaluate(
  policies: Policy[],
  action: SystemAction,
  ctx: EvalContext,
): PolicyDecision {
  for (const p of policies) validatePolicy(p);

  const matched = policies.filter((p) => matchesCondition(p.rule.condition, action, ctx));
  const effect = resolveEffect(matched);
  const rationale = explain(matched);

  return { effect, matchedPolicies: matched.map((p) => p.id), rationale };
}
