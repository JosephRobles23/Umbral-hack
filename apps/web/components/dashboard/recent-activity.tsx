import { Hexagon, Flame, SquareTerminal, Layers } from "lucide-react";

const ACT_ICONS: Record<string, typeof Hexagon> = {
  ede: Hexagon,
  grill: Flame,
  terminal: SquareTerminal,
  c4: Layers,
};

interface ActivityItem {
  type: string;
  text: string;
  time: string;
  target: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { type: "ede", text: "EDE-000-persistence aceptada", time: "hace 2h", target: "EDE-000-persistence" },
  { type: "grill", text: "Sesión Grill Me completada — alineación 85%", time: "hace 4h", target: "grill" },
  { type: "c4", text: "Modelo C4 regenerado automáticamente", time: "hace 6h", target: "c4" },
  { type: "ede", text: "EDE-005-grill-blocking propuesta", time: "hace 1d", target: "EDE-005-grill-blocking" },
  { type: "terminal", text: "Sesión terminal finalizada", time: "hace 1d", target: "terminal" },
];

export function RecentActivity() {
  return (
    <div className="bg-bg-card border border-bg-elevated rounded-lg overflow-hidden shadow-sm">
      {MOCK_ACTIVITY.map((a, i) => {
        const Icon = ACT_ICONS[a.type] ?? Hexagon;
        return (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3.5 ${i < MOCK_ACTIVITY.length - 1 ? "border-b border-bg-elevated" : ""}`}
          >
            <span className="text-text-tertiary inline-flex shrink-0">
              <Icon size={16} />
            </span>
            <span className="text-sm flex-1">{a.text}</span>
            <span className="text-xs text-text-tertiary">{a.time}</span>
          </div>
        );
      })}
    </div>
  );
}
