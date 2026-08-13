"use client";

import { Star, ChevronRight, Users, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { useTopVectyzenAnalytics } from "@/features/dashboard-analytics/queries";

export function WidgetTopContributors({ className }: { className?: string }) {
  const { data: analyticsData, isLoading } = useTopVectyzenAnalytics();
  const items = analyticsData?.data || [];

  return (
    <div
      className={cn(
        "cyber-card clip-card flex flex-col h-auto p-4 lg:p-6",
        className,
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyber-surface-hover border border-cyber-border text-neon">
          <Users size={28} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-heading tracking-[1px] text-cyber-heading">
            Top Contributors
          </h3>
          <p className="text-[13px] text-cyber-body-subtle">
            Most active creators
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-cyber-border" />

      {/* ── Summary stat row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-baseline gap-2 text-[13px]">
          <span className="text-cyber-body">Total assets:</span>
          <span className="font-bold tabular-nums text-cyber-heading">
            1,248
          </span>
        </div>
        <div className="flex items-baseline gap-2 text-[13px]">
          <span className="text-cyber-body">Approval Rate:</span>
          <span className="font-bold tabular-nums text-cyber-heading">98%</span>
        </div>
      </div>

      {/* ── List body ── */}
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col border-t border-cyber-border py-3 animate-pulse"
            >
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <div className="h-10 w-10 rounded-full bg-cyber-surface-active border border-cyber-border-subtle" />
                  <div className="flex flex-col gap-1 w-full max-w-[120px]">
                    <div className="h-3 w-full rounded bg-cyber-body-subtle/30" />
                    <div className="h-2 w-2/3 rounded bg-cyber-body-subtle/20" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col border-t border-cyber-border py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                {/* Left: Avatar & Text */}
                <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyber-surface-active border border-cyber-border-subtle overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon size={20} className="text-cyber-body" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-cyber-heading truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-cyber-body uppercase tracking-[0.5px]">
                      {item.role}
                    </span>
                  </div>
                </div>

                {/* Middle: Metric */}
                <div className="flex-1 min-w-[120px] sm:text-center">
                  <span className="text-[12px] text-cyber-body tabular-nums">
                    {Number(item.totalAssets).toLocaleString()} items
                  </span>
                </div>

                {/* Right: Badge */}
                <div className="flex shrink-0 items-center justify-end">
                  <span className="inline-flex items-center gap-1 rounded-cyber bg-[rgba(0,230,118,0.08)] border border-[rgba(0,230,118,0.2)] px-2 py-1 text-[11px] font-medium text-neon-green tabular-nums">
                    <Star size={10} className="fill-current" />
                    {Number(item.totalDownloads).toLocaleString()} dl
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[12px] text-cyber-body-subtle border-t border-cyber-border">
            No contributors found.
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="mt-1 h-px bg-cyber-border" />
      <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <button className="flex items-center gap-1 text-[12px] font-medium text-neon transition-colors duration-150 hover:text-neon-strong">
          View report
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
