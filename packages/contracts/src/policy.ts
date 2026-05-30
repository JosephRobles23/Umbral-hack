export type PolicyEffect = "allow" | "deny" | "require_approval";

export interface Condition {
  field: string;
  operator: "equals" | "contains" | "not_equals" | "matches";
  value: string;
}

export interface PolicyRule {
  subject: string;
  condition: Condition;
  effect: PolicyEffect;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  rule: PolicyRule;
  sourceEdeId?: string;
}

export interface PolicyDecision {
  effect: PolicyEffect;
  matchedPolicies: string[];
  rationale: string;
}

export interface SystemAction {
  type: string;
  target: string;
  metadata?: Record<string, unknown>;
}

export interface EvalContext {
  actor: string;
  environment: string;
  timestamp: string;
}
