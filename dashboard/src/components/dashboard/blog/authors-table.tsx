"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Info,
  Search,
  Plus,
  Settings,
  MoreHorizontal,
  Archive,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Square,
  AlignLeft,
  Mail,
  UserPlus
} from "lucide-react";

const dummyAuthors = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@vectolio.com",
    role: "Admin",
    status: "Active",
    postsCount: 142,
    avatar: "/icon.png",
  },
  {
    id: 2,
    name: "Sarah Connor",
    email: "sarah@vectolio.com",
    role: "Editor",
    status: "Active",
    postsCount: 56,
    avatar: "/icon.png",
  },
  {
    id: 3,
    name: "Kyle Reese",
    email: "kyle@vectolio.com",
    role: "Contributor",
    status: "Inactive",
    postsCount: 12,
    avatar: "/icon.png",
  },
];

export function AuthorsTable() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      {/* ── Top Metadata Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-cyber-heading">
          <span className="text-[14px] font-medium">Total Authors:</span>
          <span className="font-bold tabular-nums">3</span>
          <Info size={14} className="text-cyber-body-subtle ml-1" />
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
          />
          <input
            type="text"
            placeholder="Search authors..."
            className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-[10px] py-[8px] pl-9 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
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

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-[12px] py-[8px] text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors">
            <UserPlus size={16} />
            Invite Author
          </button>
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="w-full overflow-x-auto rounded-cyber border border-cyber-border">
        <table className="w-full min-w-[700px] text-left text-[13px]">
          <thead className="bg-cyber-surface-active border-b border-cyber-border text-cyber-body">
            <tr>
              <th className="px-4 py-3 font-medium w-10">
                <Square size={16} className="text-cyber-body-subtle" />
              </th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Posts</th>
              <th className="px-4 py-3 font-medium w-16 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border">
            {dummyAuthors.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-cyber-surface-hover/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Square size={16} className="text-cyber-body-subtle" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-cyber-border-subtle shrink-0">
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
                  <span className="inline-flex items-center rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-0.5 text-[11px] font-medium text-cyber-body">
                    {row.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full glow-neon"
                      style={{
                        backgroundColor: row.status === "Active" ? "#00E676" : "#FF3366",
                        boxShadow: `0 0 8px ${row.status === "Active" ? "#00E676" : "#FF3366"}`,
                      }}
                    />
                    <span className="text-cyber-heading">{row.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-medium text-cyber-heading tabular-nums">{row.postsCount}</span>
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
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-8 top-10 z-20 w-40 rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon">
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
                          <Edit2 size={16} />
                          Edit Profile
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
                          <Mail size={16} />
                          Email User
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors mt-1 border-t border-cyber-border pt-2">
                          <Trash2 size={16} />
                          Remove
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
      
      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t border-cyber-border">
        <div className="flex items-center gap-3 text-[13px] text-cyber-body">
          <span className="text-cyber-body-subtle tabular-nums">
            Showing all 3 authors
          </span>
        </div>
      </div>
    </div>
  );
}
