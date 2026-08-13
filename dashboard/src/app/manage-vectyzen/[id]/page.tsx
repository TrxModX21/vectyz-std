"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ArrowLeft, CheckCircle2, Edit2, Shield, UserSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TabPersonalKYC } from "@/components/manage-vectyzen/tab-personal-kyc";
import { TabSubscriptionQuota } from "@/components/manage-vectyzen/tab-subscription-quota";
import { TabFinanceTransactions } from "@/components/manage-vectyzen/tab-finance-transactions";
import { TabAssetsActivity } from "@/components/manage-vectyzen/tab-assets-activity";
import { TabSecurityAudit } from "@/components/manage-vectyzen/tab-security-audit";

const TABS = [
  { id: "personal", label: "Personal & KYC" },
  { id: "subscription", label: "Subscription & Quota" },
  { id: "finance", label: "Finance & Economy" },
  { id: "activity", label: "Assets & Activity" },
  { id: "security", label: "Security & Audit" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function VectyzenDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  return (
    <DashboardLayout>
      {/* ── Breadcrumb & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link 
            href="/manage-vectyzen"
            className="p-2 rounded-cyber border border-cyber-border bg-cyber-surface hover:bg-cyber-surface-hover text-cyber-body transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl tracking-[1.5px] text-cyber-heading font-heading">
              Vectyzen Profile
            </h2>
            <p className="text-[12px] text-cyber-body-subtle">
              Manage detailed user information, subscription, and activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-cyber border border-cyber-border bg-cyber-surface px-4 py-2 text-[13px] font-medium text-cyber-heading hover:bg-cyber-surface-hover transition-colors">
            <UserSearch size={14} />
            Impersonate
          </button>
          <button className="flex items-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-2 text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors">
            <Edit2 size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── Header / Overview Card ── */}
      <div className="cyber-card clip-card flex flex-col md:flex-row items-start md:items-center justify-between p-6 mb-8 gap-6 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-linear-to-l from-neon/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          {/* Avatar */}
          <div className="relative h-20 w-20 rounded-full border-2 border-neon p-1 shrink-0 bg-cyber-surface-active">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src="/icon.png"
                alt="Alex Doe"
                fill
                className="object-cover"
              />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-cyber-surface bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          </div>

          {/* Identity */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-cyber-heading font-heading">Alex Doe</h3>
              <CheckCircle2 size={16} className="text-[#00E676]" />
            </div>
            <span className="text-[13px] text-cyber-body mb-2">@alexdoe_tech</span>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-neon/50 bg-neon/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neon">
                <Shield size={10} />
                Premium User
              </span>
              <span className="inline-flex items-center rounded-full border border-cyber-border bg-cyber-surface-active px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyber-body">
                Creator
              </span>
            </div>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-cyber-body-subtle mb-1">Total Assets</span>
            <span className="text-xl font-heading font-bold text-cyber-heading tabular-nums">142</span>
          </div>
          <div className="w-px h-10 bg-cyber-border" />
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-cyber-body-subtle mb-1">Followers</span>
            <span className="text-xl font-heading font-bold text-cyber-heading tabular-nums">2,405</span>
          </div>
          <div className="w-px h-10 bg-cyber-border" />
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-cyber-body-subtle mb-1">Credit Bal</span>
            <span className="text-xl font-heading font-bold text-neon glow-text-neon tabular-nums">3,450</span>
          </div>
        </div>
      </div>

      {/* ── Custom Tab Navigation ── */}
      <div className="flex flex-col w-full">
        {/* Tab List */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-cyber-border mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={cn(
                  "relative px-4 py-3 text-[13px] font-medium transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "text-neon"
                    : "text-cyber-body hover:text-cyber-heading hover:bg-cyber-surface-hover/50"
                )}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon glow-neon shadow-[0_0_8px_rgba(84,234,253,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-100">
          {activeTab === "personal" && <TabPersonalKYC />}
          {activeTab === "subscription" && <TabSubscriptionQuota />}
          {activeTab === "finance" && <TabFinanceTransactions />}
          {activeTab === "activity" && <TabAssetsActivity />}
          {activeTab === "security" && <TabSecurityAudit />}
        </div>
      </div>
    </DashboardLayout>
  );
}
