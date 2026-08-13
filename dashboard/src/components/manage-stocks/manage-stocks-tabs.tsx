import { Layers, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";

interface ManageStocksTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  // Dummy counts for UI
  counts?: Record<string, number>;
}

const ManageStocksTabs = ({ currentTab, onTabChange, counts }: ManageStocksTabsProps) => {
  const tabs = [
    { id: "all", label: "All Assets", icon: Layers, count: counts?.all || 0 },
    { id: "PENDING", label: "Pending Review", icon: Clock, count: counts?.pending || 0, color: "text-[#FFD166]" },
    { id: "APPROVED", label: "Approved", icon: CheckCircle2, count: counts?.approved || 0, color: "text-neon" },
    { id: "REJECTED", label: "Rejected", icon: XCircle, count: counts?.rejected || 0, color: "text-[#FF3366]" },
    { id: "DELETED", label: "Deleted", icon: Trash2, count: counts?.deleted || 0, color: "text-[#FF3366]/80" },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 border-b border-cyber-border-subtle overflow-x-auto pb-px">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? "border-neon text-cyber-heading bg-neon/5"
                : "border-transparent text-cyber-body-subtle hover:text-cyber-heading hover:bg-cyber-surface-hover"
            }`}
          >
            <Icon size={16} className={tab.color || ""} />
            <span className="text-[14px] font-medium">{tab.label}</span>
            <span
              className={`ml-1 flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                isActive
                  ? "bg-neon/20 text-neon"
                  : "bg-cyber-surface-active text-cyber-body"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ManageStocksTabs;
