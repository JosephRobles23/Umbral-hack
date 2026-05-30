export type HookPoint =
  | "pre_context_assembly"
  | "post_response_validation"
  | "pre_gate_evaluation"
  | "post_artifact_persist";

type HookFn = (...args: unknown[]) => void;

export class HookRegistry {
  private hooks = new Map<HookPoint, HookFn[]>();

  register(point: HookPoint, fn: HookFn): void {
    const fns = this.hooks.get(point) ?? [];
    fns.push(fn);
    this.hooks.set(point, fns);
  }

  run(point: HookPoint, ...args: unknown[]): void {
    for (const fn of this.hooks.get(point) ?? []) {
      fn(...args);
    }
  }

  clear(point?: HookPoint): void {
    if (point) {
      this.hooks.delete(point);
    } else {
      this.hooks.clear();
    }
  }
}
