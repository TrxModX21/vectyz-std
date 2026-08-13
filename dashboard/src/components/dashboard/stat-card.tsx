import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  subValue,
  change,
  changeType,
  icon: Icon,
  delay = 0,
  isLoading = false,
}: StatCardProps) {
  return (
    <div
      className="cyber-card clip-card relative overflow-hidden p-5 transition-all duration-150 ease-out hover:border-[rgba(84,234,253,0.25)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Scanline effect on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100 scanline-overlay" />

      <div className="flex items-start justify-between">
        {/* Icon container */}
        <div className="flex h-10 w-10 items-center justify-center rounded-cyber bg-cyber-brand-soft border border-[rgba(84,234,253,0.12)]">
          <Icon size={20} className="text-[#54EAFD]" />
        </div>

        {/* Change badge */}
        {/* <div
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-cyber",
            changeType === "positive"
              ? "bg-[rgba(0,230,118,0.08)] text-[#00E676] border border-[rgba(0,230,118,0.2)]"
              : "bg-[rgba(255,0,60,0.08)] text-[#FF003C] border border-[rgba(255,0,60,0.2)]",
          )}
        >
          {changeType === "positive" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {change}
        </div> */}
      </div>

      {/* Value */}
      <div className="mt-4 flex flex-col">
        {isLoading ? (
          <div className="mb-0.5 mt-0.5 h-8 w-28 rounded-md bg-cyber-body/30 animate-pulse" />
        ) : (
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-wide text-cyber-heading font-heading">
              {value}
            </p>
            {subValue && (
              <span className="text-xs font-medium text-cyber-body-subtle">
                {subValue}
              </span>
            )}
          </div>
        )}
        <p className="mt-1 text-[12px] font-medium uppercase tracking-wider text-cyber-body">
          {title}
        </p>
      </div>
    </div>
  );
}
