# SLICE 7 — Policy-as-Code (Motor de Políticas)

> Las prohibiciones de la EDE se vuelven ejecutables. **Dogfooding.**

## Objetivo
Un motor que interpreta el DSL JSON declarativo (EDE-001) y evalúa políticas en runtime, derivando reglas del campo `whatNotToDo` de las EDEs.

## EDEs que materializa
`EDE-001-pac-dsl`. Introduce `S4`.

## Contratos que toca
- **L2→L3**: `PolicyDecision` cumple schema versionado; rationale alimenta la documentación (S2).

## Scaffolding
```
packages/contracts/src/policy.ts    # Policy, PolicyDecision, DSL (S4)
packages/specialists/src/policy-engine/engine.ts    # intérprete del DSL
packages/specialists/src/policy-engine/from-ede.ts   # deriva políticas de whatNotToDo
```

## Archivo clave — DSL declarativo (EDE-001)
```ts
// Regla declarativa, NO imperativa. Validada por schema al cargar (fail-fast S13).
type Rule = { subject: string; condition: Condition; effect: "allow" | "deny" | "require_approval" };
export function evaluate(policies: Policy[], action: SystemAction, ctx: EvalContext): PolicyDecision {
  const matched = policies.filter(p => matches(p.rule.condition, action, ctx));
  const effect = resolveEffect(matched);   // deny > require_approval > allow
  return { effect, matchedPolicies: matched.map(p => p.id), rationale: explain(matched) };
}
```

## Criterios de aceptación
- [ ] El motor evalúa allow/deny/require_approval contra un EvalContext.
- [ ] Una regla con schema inválido es rechazada al cargar (fail-fast).
- [ ] Una política se deriva automáticamente del `whatNotToDo` de una EDE.
- [ ] La evaluación es runtime, no build.

## Tests (S12, vía gates)
- `engine.test.ts`: allow, deny, require_approval; deriva desde EDE; rechaza regla inválida.

## Exit condition
El "Qué No Hacer" de las EDEs ya no es letra muerta: un motor lo hace cumplir en runtime.
