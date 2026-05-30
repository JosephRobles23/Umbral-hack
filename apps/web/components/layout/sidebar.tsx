"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Hexagon,
  Flame,
  SquareTerminal,
  Layers,
  Share2,
  ShieldCheck,
  Check,
  Sun,
  Moon,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "/operatives", label: "Operativos", icon: Hexagon },
  { id: "/grill", label: "Grill Me", icon: Flame },
  { id: "/terminal", label: "Terminal", icon: SquareTerminal },
  { id: "/c4", label: "Modelo C4", icon: Layers },
  { id: "/graft", label: "Graft", icon: Share2 },
  { id: "/policies", label: "Políticas", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="w-sidebar shrink-0 h-screen sticky top-0 bg-bg-sidebar border-r border-bg-elevated py-6 px-4 flex flex-col"
      aria-label="Navegación principal"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 h-12 mb-4 px-2">
        <span className="w-7 h-7 rounded-lg shrink-0 bg-gradient-to-br from-accent to-accent-pressed flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 4 6.5V12c0 4.5 3.2 7.2 8 9 4.8-1.8 8-4.5 8-9V6.5z" />
            <path d="M9 11.5h6M12 8.5v6" opacity="0.85" />
          </svg>
        </span>
        <span className="font-display text-lg font-medium tracking-[-0.02em]">
          Umbral
        </span>
      </div>

      <hr className="border-bg-elevated mb-4" />

      {/* Navigation */}
      <div className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.id);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.id}
              className={`flex items-center gap-2.5 h-10 px-3 rounded-md text-[13px] font-medium transition-all duration-150 no-underline ${
                active
                  ? "bg-accent-subtle text-accent-text font-semibold"
                  : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-bg-elevated flex flex-col gap-4">
        {/* System Status */}
        <div>
          <div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-text-tertiary mb-2">
            Estado del sistema
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-text-secondary py-0.5">
            <span>CDR</span>
            <span className="text-text-primary font-semibold">0.15</span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-text-secondary py-0.5">
            <span>Gates</span>
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check size={13} />
              3/3
            </span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2.5 h-10 px-3 rounded-md text-[13px] font-medium text-text-secondary hover:bg-bg-surface hover:text-text-primary transition-all duration-150 bg-transparent border-none cursor-pointer w-full text-left"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>
    </nav>
  );
}
