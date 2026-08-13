"use client";

import { cn } from "@/lib/utils";
import { Plus, Download, FileText, UserPlus } from "lucide-react";

const actions = [
  {
    icon: Plus,
    label: "Add Product",
    variant: "brand" as const,
  },
  {
    icon: Download,
    label: "Export Data",
    variant: "secondary" as const,
  },
  {
    icon: FileText,
    label: "View Reports",
    variant: "tertiary" as const,
  },
  {
    icon: UserPlus,
    label: "Invite Team",
    variant: "ghost" as const,
  },
];

const variantStyles = {
  brand: {
    background: "#54EAFD",
    color: "#04040A",
    border: "1px solid transparent",
    hoverBg: "#3DC8DB",
    hoverColor: "#04040A",
    glow: true,
  },
  secondary: {
    background: "var(--cyber-surface-hover)",
    color: "var(--cyber-body)",
    border: "1px solid var(--cyber-border)",
    hoverBg: "var(--cyber-surface-active)",
    hoverColor: "var(--cyber-heading)",
    glow: true,
  },
  tertiary: {
    background: "var(--cyber-surface)",
    color: "var(--cyber-body)",
    border: "1px solid var(--cyber-border)",
    hoverBg: "var(--cyber-surface-hover)",
    hoverColor: "var(--cyber-heading)",
    glow: true,
  },
  ghost: {
    background: "transparent",
    color: "var(--cyber-heading)",
    border: "1px solid transparent",
    hoverBg: "var(--cyber-surface-hover)",
    hoverColor: "var(--cyber-heading)",
    glow: false,
  },
};

export function QuickActions() {
  return (
    <div className="cyber-card clip-card p-5">
      <h3 className="text-base font-semibold text-cyber-heading font-heading tracking-[1px]">
        Quick Actions
      </h3>
      <p className="mt-1 text-[12px] text-cyber-body">
        Common tasks and shortcuts
      </p>

      <div className="mt-5 flex flex-col gap-2">
        {actions.map((action) => {
          const styles = variantStyles[action.variant];
          return (
            <button
              key={action.label}
              className={cn(
                "flex w-full items-center gap-2 px-4 py-2.5 text-[13px] font-medium uppercase tracking-wider transition-all duration-150 ease-out rounded-cyber",
                action.variant !== "ghost" ? "clip-button" : "",
              )}
              style={{
                background: styles.background,
                color: styles.color,
                border: styles.border,
                boxShadow: styles.glow
                  ? "var(--cyber-shadow-xs), inset rgba(84,234,253,0.12) 0 1px 0px 0px, rgba(84,234,253,0.08) 0 0 14px -2px"
                  : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = styles.hoverBg;
                e.currentTarget.style.color = styles.hoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = styles.background;
                e.currentTarget.style.color = styles.color;
              }}
            >
              <action.icon size={16} />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
