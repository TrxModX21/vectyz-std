import { cn } from "@/lib/utils";
import {
  AlignLeft,
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  EyeOff,
  Filter,
  Info,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Square,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const dummyData = [
  {
    id: 1,
    name: "3D Assets",
    email: "assets@vectolio.com",
    role: "Premium",
    status: "Active",
    statusColor: "#00E676",
    socials: ["github", "twitter"],
    promote: true,
    rating: "4.9",
    trend: "up",
    lastLogin: "Today",
    avatar: "/icon.png",
  },
  {
    id: 2,
    name: "Vector Graphics",
    email: "vectors@vectolio.com",
    role: "Free",
    status: "Active",
    statusColor: "#00E676",
    socials: ["facebook", "linkedin"],
    promote: false,
    rating: "4.8",
    trend: "up",
    lastLogin: "Yesterday",
    avatar: "/icon.png",
  },
  {
    id: 3,
    name: "UI Templates",
    email: "ui@vectolio.com",
    role: "Premium",
    status: "Inactive",
    statusColor: "#FF3366",
    socials: ["github"],
    promote: false,
    rating: "4.5",
    trend: "down",
    lastLogin: "Last week",
    avatar: "/icon.png",
  },
  {
    id: 4,
    name: "Motion Graphics",
    email: "motion@vectolio.com",
    role: "Free",
    status: "Active",
    statusColor: "#00E676",
    socials: ["twitter", "linkedin"],
    promote: true,
    rating: "4.7",
    trend: "up",
    lastLogin: "Today",
    avatar: "/icon.png",
  },
  {
    id: 5,
    name: "Sound Effects",
    email: "sfx@vectolio.com",
    role: "Standard",
    status: "Active",
    statusColor: "#00E676",
    socials: ["facebook", "github"],
    promote: false,
    rating: "4.2",
    trend: "down",
    lastLogin: "2 days ago",
    avatar: "/icon.png",
  },
  {
    id: 6,
    name: "Fonts & Typography",
    email: "fonts@vectolio.com",
    role: "Standard",
    status: "Pending",
    statusColor: "#F5A623",
    socials: ["twitter"],
    promote: true,
    rating: "4.6",
    trend: "up",
    lastLogin: "Today",
    avatar: "/icon.png",
  },
  {
    id: 7,
    name: "Photography",
    email: "photo@vectolio.com",
    role: "Free",
    status: "Active",
    statusColor: "#00E676",
    socials: ["linkedin", "github"],
    promote: true,
    rating: "4.9",
    trend: "up",
    lastLogin: "Just now",
    avatar: "/icon.png",
  },
  {
    id: 8,
    name: "Branding Kits",
    email: "branding@vectolio.com",
    role: "Premium",
    status: "Inactive",
    statusColor: "#FF3366",
    socials: ["facebook"],
    promote: false,
    rating: "4.1",
    trend: "down",
    lastLogin: "Last month",
    avatar: "/icon.png",
  },
  {
    id: 9,
    name: "Illustrations",
    email: "illustrate@vectolio.com",
    role: "Free",
    status: "Active",
    statusColor: "#00E676",
    socials: ["github", "twitter"],
    promote: true,
    rating: "4.8",
    trend: "up",
    lastLogin: "Yesterday",
    avatar: "/icon.png",
  },
  {
    id: 10,
    name: "Cyberpunk Pack",
    email: "cyber@vectolio.com",
    role: "Premium",
    status: "Active",
    statusColor: "#00E676",
    socials: ["twitter", "linkedin"],
    promote: true,
    rating: "5.0",
    trend: "up",
    lastLogin: "Today",
    avatar: "/icon.png",
  },
];

const TableStarter = () => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Function to render social icons
  const renderSocials = (socials: string[]) => {
    return (
      <div className="flex items-center gap-2">
        {socials.includes("github") && (
          <Archive size={14} className="text-cyber-body" />
        )}
        {socials.includes("twitter") && (
          <Archive size={14} className="text-cyber-body" />
        )}
        {socials.includes("facebook") && (
          <Archive size={14} className="text-cyber-body" />
        )}
        {socials.includes("linkedin") && (
          <Archive size={14} className="text-cyber-body" />
        )}
      </div>
    );
  };

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      {/* ── Top Metadata Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-cyber-heading">
          <span className="text-[14px] font-medium">Total categories:</span>
          <span className="font-bold tabular-nums">8,967</span>
          <Info size={14} className="text-cyber-body-subtle ml-1" />
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
          />
          <input
            type="text"
            placeholder="Search for items..."
            className="w-full rounded-full border border-cyber-border bg-cyber-surface-active px-[10px] py-[8px] pl-9 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Left Cluster */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <AlignLeft size={16} />
            Actions
          </button>
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Right Cluster */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-[12px] py-[8px] text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors">
            <Plus size={16} />
            Add item
          </button>
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <Settings size={16} />
            Table settings
          </button>
          <button className="hidden lg:flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <EyeOff size={16} />
            Hide fields
          </button>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="w-full overflow-x-auto rounded-cyber border border-cyber-border">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="bg-cyber-surface-active border-b border-cyber-border text-cyber-body">
            <tr>
              <th className="px-4 py-3 font-medium w-10">
                <Square size={16} className="text-cyber-body-subtle" />
              </th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Social Profiles</th>
              <th className="px-4 py-3 font-medium">
                <div className="flex items-center gap-1">
                  Promote
                  <Info size={14} className="text-cyber-body-subtle" />
                </div>
              </th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium w-16 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border">
            {dummyData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-cyber-surface-hover/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Square size={16} className="text-cyber-body-subtle" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-cyber-border-subtle bg-cyber-surface-active shrink-0">
                      <Image
                        src={row.avatar}
                        alt={row.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-cyber-heading">
                        {row.name}
                      </span>
                      <span className="text-[11px] text-cyber-body-subtle">
                        {row.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-0.5 text-[11px] font-medium text-cyber-body">
                    {row.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full glow-neon"
                      style={{
                        backgroundColor: row.statusColor,
                        boxShadow: `0 0 8px ${row.statusColor}`,
                      }}
                    />
                    <span className="text-cyber-heading">{row.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {renderSocials(row.socials)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    className={cn(
                      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      row.promote
                        ? "bg-neon"
                        : "bg-cyber-surface-active border-cyber-border",
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        row.promote
                          ? "translate-x-4 bg-cyber-surface"
                          : "translate-x-0",
                      )}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 tabular-nums font-medium text-cyber-heading">
                    {row.rating}
                    {row.trend === "up" ? (
                      <TrendingUp size={14} className="text-[#00E676]" />
                    ) : (
                      <TrendingDown size={14} className="text-[#FF3366]" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-cyber-body">
                    <Clock size={14} className="text-cyber-body-subtle" />
                    {row.lastLogin}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === row.id ? null : row.id)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-cyber text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === row.id && (
                    <>
                      {/* Invisible overlay to catch clicks outside */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-8 top-10 z-20 w-44 rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon">
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
                          <Archive size={16} />
                          Archive
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-cyber-border">
        <div className="flex items-center gap-3 text-[13px] text-cyber-body">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <div className="relative">
              <button className="flex items-center gap-1 rounded-cyber border border-cyber-border px-2 py-1 bg-cyber-surface-active hover:bg-cyber-surface-hover transition-colors">
                10
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <span className="text-cyber-body-subtle tabular-nums">
            1–10 of 8,967
          </span>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-px rounded-cyber border border-cyber-border overflow-hidden bg-cyber-border">
          <button className="flex items-center justify-center gap-1 bg-cyber-surface px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <ChevronLeft size={16} />
            Previous
          </button>
          <button className="flex items-center justify-center gap-1 bg-cyber-surface px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableStarter;
