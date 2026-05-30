import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { Ede } from "@umbral/contracts";

export type EdeAction = "accept" | "skip";

export interface ReviewResult {
  action: EdeAction;
  edits?: {
    title?: string;
    decision?: string;
    rationale?: string;
  };
}

export async function reviewEde(ede: Ede, index: number, total: number): Promise<ReviewResult> {
  const rl = createInterface({ input: stdin, output: stdout });

  stdout.write(`\n  ${index}/${total}  ${ede.id}\n`);
  stdout.write(`       ${ede.title}\n`);
  stdout.write(`       Decision: ${ede.whatAndHow.decision}\n`);
  stdout.write(`       [A]ceptar  [E]ditar  [S]altar\n`);

  const answer = await rl.question("       > ");
  const choice = answer.trim().toLowerCase();

  if (choice === "e" || choice === "editar") {
    const title = await rl.question(`       Titulo [enter = mantener]: `);
    const decision = await rl.question(`       Decision [enter = mantener]: `);
    const rationale = await rl.question(`       Rationale [enter = mantener]: `);
    rl.close();

    return {
      action: "accept",
      edits: {
        title: title.trim() || undefined,
        decision: decision.trim() || undefined,
        rationale: rationale.trim() || undefined,
      },
    };
  }

  rl.close();

  if (choice === "s" || choice === "saltar") return { action: "skip" };
  return { action: "accept" };
}
