# SLICE 6 — Observabilidad (Langfuse + DevTools → Evidencia)

> Primera evidencia objetiva de comprensión. **Dogfooding**: este slice pasa por los gates del Slice 5.

## Objetivo
Adaptadores que normalizan trazas de Langfuse (S9) y consola de Chrome DevTools MCP (S10) a un único `ComprehensionSignal`. F4 (Comprehension Gate) lo consume sin conocer la fuente.

## EDEs que materializa
`EDE-004-evidence-adapter`. Introduce `S9` y `S10`.

## Contratos que toca
- **L2→L3 (adaptador)**: F4 itera sobre `EvidenceAdapter[]`; no importa S9/S10 por nombre.

## Scaffolding
```
packages/contracts/src/evidence.ts    # ComprehensionSignal, EvidenceAdapter (S9/S10->F4)
packages/specialists/src/adapters/langfuse-adapter.ts   # S9
packages/specialists/src/adapters/devtools-adapter.ts    # S10 (cliente Chrome DevTools MCP)
packages/orchestrator/src/phases/verify.ts   # F4 consume ComprehensionSignal[]
```

## Archivo clave — F4 desacoplado (EDE-004)
```ts
// F4 NO conoce Langfuse ni DevTools. Solo el schema.
export function comprehensionGate(adapters: EvidenceAdapter[], diff: PrDiff): GateResult {
  const signals = adapters.map(a => a.produce(diff));   // S9, S10, o cualquier futuro
  const questions = signals.flatMap(s => s.derivedQuestions);
  return { cdr: computeDebtRatio(signals), questions };  // alimenta el medidor CDR
}
```

## Viabilidad Langfuse (S9)
Langfuse expone API/SDK de lectura de trazas. El adaptador la consume vía un hook `post_response_validation` (S3). Integración **viable** a nivel de contrato; verificar el SDK vigente al implementar.

## Criterios de aceptación
- [ ] `langfuse-adapter` produce `ComprehensionSignal` válido desde trazas (retryLoops, toolMisfires...).
- [ ] `devtools-adapter` captura console.log/time vía Chrome DevTools MCP y los normaliza.
- [ ] F4 agrega señales de N adaptadores sin referenciar ninguno por nombre.
- [ ] El deb-log se correlaciona con un SessionNode (S7) vía correlationId.

## Tests (S12, vía gates del Slice 5)
- `verify.test.ts`: F4 agrega N adaptadores; señal inválida rechazada antes de F4.
- `langfuse-adapter.test.ts`, `devtools-adapter.test.ts`: producen schema válido.

## Exit condition
El Comprehension Gate usa evidencia objetiva de runtime, no solo introspección humana. La paradoja percepción-realidad (METR R2) es ahora medible.
