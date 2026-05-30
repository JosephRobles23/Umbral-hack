export interface MetricCardProps {
  label: string;
  value: string | number;
  mono?: boolean;
  trend?: string;
  trendDir?: "good" | "bad";
  progress?: number;
  progressColor?: string;
}

export function MetricCard({
  label,
  value,
  mono,
  trend,
  trendDir,
  progress,
  progressColor,
}: MetricCardProps) {
  return (
    <div className="bg-bg-card border border-bg-elevated rounded-lg p-5 shadow-sm">
      <div className="text-[13px] font-medium text-text-secondary mb-2.5">
        {label}
      </div>
      <div
        className={`text-2xl leading-[30px] tracking-[-0.02em] font-medium ${mono ? "font-mono" : "font-display"}`}
      >
        {value}
      </div>
      {trend && (
        <div
          className={`text-xs mt-1.5 flex items-center gap-1 ${trendDir === "good" ? "text-success" : "text-warning"}`}
        >
          <span>{trendDir === "good" ? "▼" : "▲"}</span>
          {trend}
        </div>
      )}
      {progress != null && (
        <div className="mt-3.5">
          <div className="h-1.5 rounded bg-bg-elevated overflow-hidden">
            <div
              className="h-full rounded transition-[width] duration-600"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor ?? "var(--accent)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
