import { ArrowDownLeft, ArrowUpRight, Coins, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy transaction data
const transactions = [
  {
    id: "TRX-001",
    type: "BUY_ASSET",
    amount: "15",
    amountCurrency: "CREDIT",
    status: "PAID",
    date: "Aug 12, 2026",
  },
  {
    id: "TRX-002",
    type: "TOPUP_CREDIT",
    amount: "Rp 150.000",
    amountCurrency: "IDR",
    status: "PAID",
    date: "Aug 10, 2026",
  },
  {
    id: "TRX-003",
    type: "SUBSCRIPTION",
    amount: "Rp 450.000",
    amountCurrency: "IDR",
    status: "FAILED",
    date: "Aug 01, 2026",
  },
  {
    id: "TRX-004",
    type: "WITHDRAWAL",
    amount: "Rp 1.000.000",
    amountCurrency: "IDR",
    status: "PENDING",
    date: "Jul 25, 2026",
  },
];

export function TabFinanceTransactions() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cyber-card clip-card flex flex-col p-5 bg-[rgba(84,234,253,0.02)] border-neon/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-cyber bg-neon/10">
              <Wallet size={16} className="text-neon" />
            </div>
            <span className="text-[12px] font-medium text-cyber-body-subtle uppercase tracking-wider">Total Balance</span>
          </div>
          <span className="text-2xl font-bold font-heading text-neon glow-text-neon tabular-nums">
            3,450 <span className="text-sm font-normal text-neon/70">CR</span>
          </span>
        </div>

        <div className="cyber-card clip-card flex flex-col p-5 bg-[rgba(0,230,118,0.02)] border-[#00E676]/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-cyber bg-[#00E676]/10">
              <ArrowDownLeft size={16} className="text-[#00E676]" />
            </div>
            <span className="text-[12px] font-medium text-cyber-body-subtle uppercase tracking-wider">Purchased (Top Up)</span>
          </div>
          <span className="text-2xl font-bold font-heading text-[#00E676] glow-text-green tabular-nums">
            1,200 <span className="text-sm font-normal text-[#00E676]/70">CR</span>
          </span>
        </div>

        <div className="cyber-card clip-card flex flex-col p-5 bg-[rgba(245,166,35,0.02)] border-[#F5A623]/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-cyber bg-[#F5A623]/10">
              <Coins size={16} className="text-[#F5A623]" />
            </div>
            <span className="text-[12px] font-medium text-cyber-body-subtle uppercase tracking-wider">Earned (Revenue)</span>
          </div>
          <span className="text-2xl font-bold font-heading text-[#F5A623] shadow-[#F5A623] tabular-nums">
            2,250 <span className="text-sm font-normal text-[#F5A623]/70">CR</span>
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="cyber-card clip-card flex flex-col w-full relative z-0">
        <div className="p-5 border-b border-cyber-border flex items-center justify-between">
          <h3 className="text-base font-heading tracking-[1px] text-neon">
            Recent Transactions
          </h3>
          <button className="text-[12px] font-medium text-cyber-body hover:text-neon transition-colors">
            View All
          </button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-cyber-surface-active text-cyber-body">
              <tr>
                <th className="px-5 py-3 font-medium">Transaction ID</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-cyber-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-cyber-heading font-medium">
                    {trx.id}
                  </td>
                  <td className="px-5 py-3 text-cyber-body">
                    {trx.type.replace("_", " ")}
                  </td>
                  <td className="px-5 py-3 font-medium tabular-nums">
                    {trx.amountCurrency === "CREDIT" ? (
                      <span className="text-neon">{trx.amount} CR</span>
                    ) : (
                      <span className="text-cyber-heading">{trx.amount}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
                        trx.status === "PAID" && "border-[#00E676]/30 bg-[#00E676]/10 text-[#00E676]",
                        trx.status === "PENDING" && "border-[#F5A623]/30 bg-[#F5A623]/10 text-[#F5A623]",
                        trx.status === "FAILED" && "border-[#FF3366]/30 bg-[#FF3366]/10 text-[#FF3366]"
                      )}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-cyber-body-subtle text-right">
                    {trx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
