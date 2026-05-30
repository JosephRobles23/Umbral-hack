import { Sidebar } from "@/components/layout/sidebar";
import { TerminalProvider } from "@/components/terminal/terminal-context";
import { PersistentTerminal } from "@/components/terminal/persistent-terminal";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TerminalProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 relative">
          {children}
          <PersistentTerminal />
        </main>
      </div>
    </TerminalProvider>
  );
}
