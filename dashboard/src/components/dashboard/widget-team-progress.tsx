"use client";

import { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Info,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Typed data ─── */
interface StatusCard {
  label: string;
  count: number;
  bg: string;
  text: string;
}

interface DetailRow {
  label: string;
  value: string;
  icon?: "trend" | "calendar" | "external";
}

interface ProgressData {
  statuses: StatusCard[];
  details: DetailRow[];
  rings: { name: string; value: number; fill: string }[];
}

const dataSets: Record<string, ProgressData> = {
  "Last 7 days": {
    statuses: [
      { label: "To do", count: 5, bg: "rgba(84,234,253,0.08)", text: "#54EAFD" },
      { label: "In progress", count: 10, bg: "rgba(180,77,255,0.08)", text: "#B44DFF" },
      { label: "Done", count: 18, bg: "rgba(0,230,118,0.08)", text: "#00E676" },
    ],
    details: [
      { label: "Average task completion rate", value: "↑ 78%", icon: "trend" },
      { label: "Days until sprint ends", value: "4 days" },
      { label: "Upcoming meeting", value: "Monday 28", icon: "calendar" },
    ],
    rings: [
      { name: "To do", value: 15, fill: "#54EAFD" },
      { name: "In progress", value: 55, fill: "#B44DFF" },
      { name: "Done", value: 85, fill: "#00E676" },
    ],
  },
  "Last 30 days": {
    statuses: [
      { label: "To do", count: 12, bg: "rgba(84,234,253,0.08)", text: "#54EAFD" },
      { label: "In progress", count: 24, bg: "rgba(180,77,255,0.08)", text: "#B44DFF" },
      { label: "Done", count: 56, bg: "rgba(0,230,118,0.08)", text: "#00E676" },
    ],
    details: [
      { label: "Average task completion rate", value: "↑ 82%", icon: "trend" },
      { label: "Days until sprint ends", value: "12 days" },
      { label: "Upcoming meeting", value: "Friday 1", icon: "calendar" },
    ],
    rings: [
      { name: "To do", value: 13, fill: "#54EAFD" },
      { name: "In progress", value: 40, fill: "#B44DFF" },
      { name: "Done", value: 90, fill: "#00E676" },
    ],
  },
};

/* Custom tooltip for radial chart */
function RingTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="border bg-cyber-surface-raised border-cyber-border px-3 py-2 rounded-cyber text-xs">
      <p className="font-medium text-cyber-heading">{name}</p>
      <p className="text-neon tabular-nums">{value}%</p>
    </div>
  );
}

export function WidgetTeamProgress() {
  const [period, setPeriod] = useState("Last 7 days");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const data = dataSets[period];

  /* Add background ring for each segment (100% track) */
  const chartData = data.rings.map((r) => ({
    ...r,
    fullMark: 100,
  }));

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <h3 className="text-base font-heading tracking-[1px] text-cyber-heading">
          Team Progress
        </h3>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-cyber text-cyber-body-subtle transition-colors duration-150 hover:text-cyber-heading hover:bg-cyber-surface-hover"
          title="Team sprint progress overview"
        >
          <Info size={14} />
        </button>
      </div>
      <div className="my-3 h-px bg-cyber-border" />

      {/* ── Status summary band ── */}
      <div className="flex gap-3 rounded-cyber bg-cyber-surface-raised p-3">
        {data.statuses.map((s) => (
          <div
            key={s.label}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-cyber p-3"
            style={{ background: s.bg }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold font-heading tabular-nums"
              style={{ color: s.text, border: `2px solid ${s.text}` }}
            >
              {s.count}
            </div>
            <span className="text-[11px] font-medium text-cyber-body">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Expandable details ── */}
      <div className="mt-4">
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-neon transition-colors duration-150 hover:text-neon-strong"
        >
          {detailsOpen ? "Hide details" : "Show more details"}
          {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {detailsOpen && (
          <div className="mt-3 flex flex-col gap-2.5">
            {data.details.map((d) => (
              <div
                key={d.label}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="flex items-center gap-1.5 text-[12px] text-cyber-body">
                  {d.label}
                  {d.icon === "external" && (
                    <ExternalLink size={10} className="text-cyber-body-subtle" />
                  )}
                </span>
                <span
                  className={cn(
                    "rounded-cyber px-2 py-0.5 text-[11px] font-medium tabular-nums",
                    d.icon === "trend"
                      ? "bg-[rgba(0,230,118,0.08)] text-[#00E676] border border-[rgba(0,230,118,0.2)]"
                      : "bg-cyber-surface-hover text-cyber-heading border border-cyber-border",
                  )}
                >
                  {d.icon === "calendar" && (
                    <CalendarDays size={10} className="mr-1 inline-block" />
                  )}
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Chart body ── */}
      <div className="mt-6 flex justify-center">
        <div className="h-[180px] w-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="95%"
              data={chartData}
              startAngle={180}
              endAngle={-180}
              barSize={12}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: "var(--cyber-surface-raised)" }}
              />
              <Tooltip content={<RingTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Legend row ── */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {data.rings.map((r) => (
          <div key={r.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: r.fill }}
            />
            <span className="text-cyber-body">{r.name}</span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="mt-6 h-px bg-cyber-border" />
      <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
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
            <div className="absolute bottom-full left-0 z-20 mb-1 min-w-[140px] border bg-cyber-surface border-cyber-border rounded-cyber overflow-hidden">
              {Object.keys(dataSets).map((p) => (
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
          Users report
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
