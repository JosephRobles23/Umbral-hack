"use client";

import { useState } from "react";
import type { Ede } from "@umbral/contracts";
import { useTerminal } from "@/components/terminal/terminal-context";
import { Button, Select } from "@/components/ui";

export function TerminalLauncher({ edes }: { edes: Ede[] }) {
  const { session, launching, launch } = useTerminal();
  const [selectedEde, setSelectedEde] = useState<string>("");
  const [shell, setShell] = useState<string>("claude");

  if (session) return null;

  return (
    <div className="bg-term-surface border border-term-border rounded-lg p-8 max-w-[440px] mx-auto mt-10 text-term-text">
      <h2 className="text-base font-semibold mb-4 m-0">Launch Terminal</h2>

      <div className="mb-3">
        <label className="block text-xs font-medium text-term-dim mb-1.5">
          Shell
        </label>
        <Select
          value={shell}
          options={[
            { value: "claude", label: "Claude Code (claude)" },
            { value: "powershell.exe", label: "PowerShell" },
            { value: "cmd.exe", label: "CMD" },
          ]}
          onChange={setShell}
          dark
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-term-dim mb-1.5">
          EDE Context (optional)
        </label>
        <Select
          value={selectedEde}
          options={[
            { value: "", label: "All EDEs (generates CLAUDE.md with all)" },
            ...edes.map((ede) => ({
              value: ede.id,
              label: `${ede.id}: ${ede.title}`,
            })),
          ]}
          onChange={setSelectedEde}
          dark
        />
      </div>

      <Button
        onClick={() => launch({ shell, edeId: selectedEde })}
        loading={launching}
        block
      >
        Launch Terminal
      </Button>
    </div>
  );
}
