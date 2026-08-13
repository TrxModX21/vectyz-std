"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Info, Download, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTrafficAnalytics } from "@/features/dashboard-analytics/queries";
import { Loader2 } from "lucide-react";

const PERIODS = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];
const COLORS = ["#54EAFD", "#FF2A85", "#9D4EDD", "#FFC107", "#00FF66", "#FF5722"];

const devices = ["Desktop", "Tablet", "Mobile"] as const;

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const { name, value } = payload[0];
  return (
    <div className="border bg-cyber-surface-raised border-cyber-border px-3 py-2 rounded-cyber text-xs">
      <p className="font-medium text-cyber-heading">{name}</p>
      <p className="text-neon tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

export function WidgetTraffic({ className }: { className?: string }) {
  const [period, setPeriod] = useState("Last 7 days");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [activeDevices, setActiveDevices] = useState<Set<string>>(
    new Set(devices),
  );

  const { data: analyticsData, isLoading } = useTrafficAnalytics(period);
  const data = analyticsData?.data || { totalSessions: 0, totalActiveUsers: 0, rows: [] };

  const visibleSegments = useMemo(() => {
    const allowedDevices = new Set(activeDevices);
    
    // Filter rows by device
    const filteredRows = data.rows.filter(r => {
      const deviceStr = r.device.toLowerCase();
      return Array.from(allowedDevices).some(d => d.toLowerCase() === deviceStr);
    });
    
    // Group by channel
    const channelMap = new Map<string, number>();
    filteredRows.forEach(r => {
      const current = channelMap.get(r.channel) || 0;
      channelMap.set(r.channel, current + r.sessions);
    });
    
    return Array.from(channelMap.entries()).map(([name, value]) => ({
      name,
      value,
      display: value.toLocaleString(),
    })).sort((a, b) => b.value - a.value);
  }, [data.rows, activeDevices]);

  const uniquePercent = data.totalSessions > 0 
    ? `${((data.totalActiveUsers / data.totalSessions) * 100).toFixed(1)}%` 
    : "0%";

  const toggleDevice = (d: string) => {
    setActiveDevices((prev) => {
      const next = new Set(prev);
      if (next.has(d)) {
        if (next.size > 1) next.delete(d);
      } else {
        next.add(d);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "cyber-card clip-card flex h-135 flex-col p-4 lg:p-6 col-span-1",
        className,
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-heading tracking-[1px] text-cyber-heading">
            Website Traffic
          </h3>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-cyber text-cyber-body-subtle transition-colors duration-150 hover:text-cyber-heading hover:bg-cyber-surface-hover"
            title="Traffic breakdown by source"
          >
            <Info size={14} />
          </button>
        </div>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-cyber text-cyber-body transition-colors duration-150 hover:text-cyber-heading hover:bg-cyber-surface-hover"
          title="Export data"
        >
          <Download size={14} />
        </button>
      </div>
      <div className="my-3 h-px bg-cyber-border" />

      {/* ── Filter row ── */}
      <div className="flex flex-wrap items-center gap-4">
        {devices.map((d) => (
          <label
            key={d}
            className="flex cursor-pointer items-center gap-2 text-[13px] text-cyber-body transition-colors duration-150 hover:text-cyber-heading"
          >
            <input
              type="checkbox"
              checked={activeDevices.has(d)}
              onChange={() => toggleDevice(d)}
              className="h-4 w-4 cursor-pointer appearance-none rounded-sm border bg-cyber-surface-hover transition-all duration-150 border-cyber-border checked:border-neon checked:bg-neon"
            />
            {d}
          </label>
        ))}
      </div>

      {/* ── Chart body ── */}
      <div className="relative flex flex-1 items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-cyber-body-subtle animate-pulse">
            <Loader2 size={32} className="animate-spin text-neon/50" />
            <span className="text-[11px] uppercase tracking-widest">Loading Analytics...</span>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visibleSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {visibleSegments.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={COLORS[idx % COLORS.length]}
                      className="transition-opacity duration-150 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-heading tabular-nums text-cyber-heading">
                {uniquePercent}
              </span>
              <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-cyber-body">
                Unique visitors
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Legend grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-h-20 overflow-y-auto pr-2 custom-scrollbar">
        {!isLoading && visibleSegments.length === 0 && (
          <span className="text-[12px] text-cyber-body-subtle col-span-2 text-center">No traffic data found.</span>
        )}
        {visibleSegments.map((seg, idx) => (
          <div key={seg.name} className="flex items-center gap-2 text-[13px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: COLORS[idx % COLORS.length] }}
            />
            <span className="text-cyber-body truncate max-w-25" title={seg.name}>{seg.name}:</span>
            <span className="tabular-nums font-medium text-cyber-heading ml-auto">
              {seg.display}
            </span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="mt-3 h-px bg-cyber-border" />
      <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Period dropdown */}
        <div className="relative">
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-1 rounded-cyber border border-cyber-border px-3 py-2 text-[12px] font-medium text-cyber-body transition-colors duration-150 hover:bg-cyber-surface-hover hover:text-cyber-heading"
          >
            {period}
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform duration-150",
                periodOpen ? "rotate-180" : "rotate-0",
              )}
            />
          </button>
          {periodOpen && (
            <div className="absolute bottom-full left-0 z-20 mb-1 min-w-35 border bg-cyber-surface border-cyber-border rounded-cyber overflow-hidden">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setPeriodOpen(false);
                  }}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-[12px] transition-colors duration-150",
                    p === period
                      ? "bg-cyber-surface-active text-neon"
                      : "text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="flex items-center gap-1 text-[12px] font-medium text-neon transition-colors duration-150 hover:text-neon-strong">
          Website report
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
