import { Calendar, Download, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function TabSubscriptionQuota() {
  const premiumUsed = 85;
  const premiumTotal = 100;
  const premiumPercentage = (premiumUsed / premiumTotal) * 100;

  const freeUsed = 12;
  const freeTotal = 20;
  const freePercentage = (freeUsed / freeTotal) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Current Plan */}
      <div className="cyber-card clip-card flex flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-heading tracking-[1px] text-neon">
            Current Plan
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(84,234,253,0.1)] border border-neon px-2.5 py-0.5 text-[11px] font-medium text-neon">
            Premium
          </span>
        </div>
        
        <div className="flex flex-col gap-1 mb-6">
          <span className="text-3xl font-heading text-cyber-heading font-bold">
            Creator Pro
          </span>
          <span className="text-[13px] text-cyber-body">Yearly Billing Cycle</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-cyber-surface-active flex items-center justify-center shrink-0">
              <Calendar size={14} className="text-cyber-body-subtle" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-widest text-cyber-body-subtle">Expires At</span>
              <span className="text-[14px] text-cyber-heading font-medium">October 15, 2026</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-cyber-surface-active flex items-center justify-center shrink-0">
              <RefreshCw size={14} className="text-cyber-body-subtle" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-widest text-cyber-body-subtle">Auto Renew</span>
              <span className="text-[14px] text-cyber-heading font-medium">Enabled</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-cyber-border flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-cyber-surface-active px-4 py-2 text-[13px] font-medium text-cyber-heading hover:bg-cyber-surface-hover transition-colors">
            Change Plan
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 rounded-cyber border border-[#FF3366] bg-[rgba(255,51,102,0.1)] px-4 py-2 text-[13px] font-medium text-[#FF3366] hover:bg-[rgba(255,51,102,0.2)] transition-colors">
            Cancel Subs
          </button>
        </div>
      </div>

      {/* Usage Quota */}
      <div className="cyber-card clip-card flex flex-col p-6">
        <h3 className="text-base font-heading tracking-[1px] text-neon mb-6">
          Usage Quota
        </h3>
        
        <div className="flex flex-col gap-6">
          {/* Premium Quota */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-neon" />
                <span className="text-[13px] font-medium text-cyber-heading">Premium Downloads</span>
              </div>
              <div className="text-[13px]">
                <span className="text-cyber-heading font-medium">{premiumUsed}</span>
                <span className="text-cyber-body-subtle"> / {premiumTotal}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full bg-cyber-surface-active rounded-full overflow-hidden border border-cyber-border-subtle">
              <div 
                className="h-full bg-neon transition-all duration-500 shadow-[0_0_10px_rgba(84,234,253,0.8)]"
                style={{ width: `${premiumPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-cyber-body-subtle mt-2 text-right">
              Resets on Aug 15, 2026
            </p>
          </div>

          <div className="h-px w-full bg-cyber-border-subtle" />

          {/* Daily Free Quota */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-[#00E676]" />
                <span className="text-[13px] font-medium text-cyber-heading">Daily Free Downloads</span>
              </div>
              <div className="text-[13px]">
                <span className="text-cyber-heading font-medium">{freeUsed}</span>
                <span className="text-cyber-body-subtle"> / {freeTotal}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full bg-cyber-surface-active rounded-full overflow-hidden border border-cyber-border-subtle">
              <div 
                className={cn(
                  "h-full transition-all duration-500 shadow-[0_0_10px_rgba(0,230,118,0.8)]",
                  freePercentage > 80 ? "bg-[#F5A623] shadow-[0_0_10px_rgba(245,166,35,0.8)]" : "bg-[#00E676]"
                )}
                style={{ width: `${freePercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-cyber-body-subtle mt-2 text-right">
              Resets in 5 hours 23 mins
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className="w-full flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-cyber-surface px-4 py-2 text-[13px] font-medium text-cyber-body hover:text-cyber-heading hover:bg-cyber-surface-hover transition-colors">
            Reset Daily Quota Manually
          </button>
        </div>
      </div>
    </div>
  );
}
