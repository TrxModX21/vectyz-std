"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const periods = ["7D", "30D", "90D", "1Y"];

export function ChartPlaceholder() {
  const [activePeriod, setActivePeriod] = useState("30D");

  return (
    <div className="cyber-card clip-card relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-cyber-heading font-heading tracking-[1px]">
            Revenue Overview
          </h3>
          <p className="mt-1 text-[12px] text-cyber-body">
            Track your earnings performance
          </p>
        </div>

        {/* Period tabs */}
        <div className="flex gap-0.5 border p-1 rounded-cyber bg-cyber-surface-raised border-cyber-border">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={cn(
                "px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-all duration-150 ease-out rounded-cyber bg-transparent text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading",
                activePeriod === period
                  ? "bg-[#54EAFD] text-[#04040A] shadow-[0_1px_4px_rgba(84,234,253,0.2)]"
                  : "bg-transparent text-cyber-body shadow-none",
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="relative h-64 px-5 pb-5">
        {/* Y-axis labels */}
        <div className="absolute left-5 top-0 flex h-full flex-col justify-between text-[10px] py-2 text-cyber-body-subtle">
          {["$50K", "$40K", "$30K", "$20K", "$10K", "$0"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative overflow-hidden rounded-cyber">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-b border-cyber-body-subtle opacity-20"
              style={{
                top: `${(i / 5) * 100}%`,
              }}
            />
          ))}

          {/* Simulated chart area gradient */}
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(84,234,253,0.25)" />
                <stop offset="100%" stopColor="rgba(84,234,253,0)" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d="M0,180 C40,170 80,120 120,130 C160,140 200,80 240,90 C280,100 320,50 360,60 C400,70 440,30 480,40 C520,50 560,20 600,35 C640,50 680,25 720,15 L720,220 L0,220 Z"
              fill="url(#chartGrad)"
            />
            {/* Line */}
            <path
              d="M0,180 C40,170 80,120 120,130 C160,140 200,80 240,90 C280,100 320,50 360,60 C400,70 440,30 480,40 C520,50 560,20 600,35 C640,50 680,25 720,15"
              fill="none"
              stroke="#54EAFD"
              strokeWidth="2"
              className="drop-shadow-[0_0_6px_rgba(84,234,253,0.5)]"
            />
            {/* Data point dots */}
            {[
              [0, 180],
              [120, 130],
              [240, 90],
              [360, 60],
              [480, 40],
              [600, 35],
              [720, 15],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="#04040A"
                stroke="#54EAFD"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Scanline animation */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(84,234,253,0.03) 50%, transparent 100%)",
              animation: "scan-line 4s linear infinite",
            }}
          />
        </div>

        {/* X-axis labels */}
        <div className="ml-10 mt-2 flex justify-between text-[10px] text-cyber-body-subtle">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
