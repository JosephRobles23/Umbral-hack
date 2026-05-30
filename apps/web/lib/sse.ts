import type { C4RegenTrigger } from "@umbral/contracts";

type Listener = (trigger: C4RegenTrigger) => void;

const g = globalThis as unknown as { __umbral_sse_listeners?: Set<Listener> };
if (!g.__umbral_sse_listeners) {
  g.__umbral_sse_listeners = new Set();
}

export function subscribe(listener: Listener): () => void {
  g.__umbral_sse_listeners!.add(listener);
  return () => g.__umbral_sse_listeners!.delete(listener);
}

export function broadcast(trigger: C4RegenTrigger): void {
  for (const listener of g.__umbral_sse_listeners!) {
    listener(trigger);
  }
}
