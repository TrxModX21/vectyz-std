import { DownloadCloud, Eye, Heart, Image as ImageIcon, LayoutGrid } from "lucide-react";
import Image from "next/image";

// Dummy assets data
const uploadedStocks = [
  {
    id: "STK-001",
    title: "Cyberpunk City Background",
    category: "Backgrounds",
    status: "APPROVED",
    downloads: 124,
    views: 1042,
    likes: 56,
  },
  {
    id: "STK-002",
    title: "Neon UI Kit Elements",
    category: "UI Templates",
    status: "APPROVED",
    downloads: 89,
    views: 654,
    likes: 32,
  },
  {
    id: "STK-003",
    title: "Abstract Tech Lines",
    category: "Vectors",
    status: "PENDING",
    downloads: 0,
    views: 0,
    likes: 0,
  },
];

export function TabAssetsActivity() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Activity Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cyber-card clip-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyber-body-subtle">
            <ImageIcon size={14} />
            <span className="text-[11px] uppercase tracking-widest">Total Uploads</span>
          </div>
          <span className="text-xl font-bold font-heading text-cyber-heading tabular-nums">45</span>
        </div>
        <div className="cyber-card clip-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyber-body-subtle">
            <DownloadCloud size={14} />
            <span className="text-[11px] uppercase tracking-widest">Total Downloads</span>
          </div>
          <span className="text-xl font-bold font-heading text-cyber-heading tabular-nums">1,240</span>
        </div>
        <div className="cyber-card clip-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyber-body-subtle">
            <Heart size={14} />
            <span className="text-[11px] uppercase tracking-widest">Total Likes</span>
          </div>
          <span className="text-xl font-bold font-heading text-cyber-heading tabular-nums">389</span>
        </div>
        <div className="cyber-card clip-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyber-body-subtle">
            <LayoutGrid size={14} />
            <span className="text-[11px] uppercase tracking-widest">Collections</span>
          </div>
          <span className="text-xl font-bold font-heading text-cyber-heading tabular-nums">8</span>
        </div>
      </div>

      {/* Uploaded Stocks Table */}
      <div className="cyber-card clip-card flex flex-col w-full relative z-0">
        <div className="p-5 border-b border-cyber-border flex items-center justify-between">
          <h3 className="text-base font-heading tracking-[1px] text-neon">
            Recent Uploads (Stocks)
          </h3>
          <button className="text-[12px] font-medium text-cyber-body hover:text-neon transition-colors">
            View All Assets
          </button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-cyber-surface-active text-cyber-body">
              <tr>
                <th className="px-5 py-3 font-medium">Asset ID</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-center">Status</th>
                <th className="px-5 py-3 font-medium text-center">Metrics (D/V/L)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border">
              {uploadedStocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-cyber-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-cyber-body-subtle font-medium">
                    {stock.id}
                  </td>
                  <td className="px-5 py-3 text-cyber-heading font-medium">
                    {stock.title}
                  </td>
                  <td className="px-5 py-3 text-cyber-body">
                    {stock.category}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${
                        stock.status === "APPROVED"
                          ? "border-[#00E676]/30 bg-[#00E676]/10 text-[#00E676]"
                          : "border-[#F5A623]/30 bg-[#F5A623]/10 text-[#F5A623]"
                      }`}
                    >
                      {stock.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-3 text-cyber-body-subtle tabular-nums text-[12px]">
                      <span className="flex items-center gap-1"><DownloadCloud size={12}/>{stock.downloads}</span>
                      <span className="flex items-center gap-1"><Eye size={12}/>{stock.views}</span>
                      <span className="flex items-center gap-1"><Heart size={12}/>{stock.likes}</span>
                    </div>
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
