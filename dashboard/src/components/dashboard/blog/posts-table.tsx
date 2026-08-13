"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Info,
  Search,
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
  Eye,
  CalendarDays,
  Send,
  PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";

const dummyPosts = [
  {
    id: 1,
    title: "10 Best UI Design Trends for 2026",
    slug: "10-best-ui-design-trends-2026",
    category: "Design",
    author: { name: "Alex Johnson", avatar: "/icon.png" },
    status: "Published",
    statusColor: "#00E676",
    views: "12.5k",
    date: "12 Oct 2026",
    thumbnail: "/icon.png",
  },
  {
    id: 2,
    title: "How to use Vectolio for Marketing",
    slug: "how-to-use-vectolio-marketing",
    category: "Tutorials",
    author: { name: "Sarah Connor", avatar: "/icon.png" },
    status: "Draft",
    statusColor: "#F5A623",
    views: "-",
    date: "-",
    thumbnail: "/icon.png",
  },
  {
    id: 3,
    title: "The Rise of Cyberpunk Aesthetics",
    slug: "rise-of-cyberpunk-aesthetics",
    category: "Inspiration",
    author: { name: "Alex Johnson", avatar: "/icon.png" },
    status: "Scheduled",
    statusColor: "#54EAFD",
    views: "-",
    date: "15 Oct 2026",
    thumbnail: "/icon.png",
  },
  {
    id: 4,
    title: "Mastering Neon Glow in CSS",
    slug: "mastering-neon-glow-css",
    category: "Development",
    author: { name: "Kyle Reese", avatar: "/icon.png" },
    status: "Published",
    statusColor: "#00E676",
    views: "8.2k",
    date: "05 Oct 2026",
    thumbnail: "/icon.png",
  },
  {
    id: 5,
    title: "Top 5 Free Vector Packs this Month",
    slug: "top-5-free-vector-packs",
    category: "Resources",
    author: { name: "Sarah Connor", avatar: "/icon.png" },
    status: "Archived",
    statusColor: "#FF3366",
    views: "45.1k",
    date: "01 Jan 2026",
    thumbnail: "/icon.png",
  },
];

export function BlogPostsTable() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="cyber-card clip-card flex flex-col p-4 lg:p-6 w-full relative z-0">
      {/* ── Top Metadata Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-cyber-heading">
          <span className="text-[14px] font-medium">Total Posts:</span>
          <span className="font-bold tabular-nums">1,204</span>
          <Info size={14} className="text-cyber-body-subtle ml-1" />
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
          />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-[10px] py-[8px] pl-9 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
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
          <Link href="/manage-blog/posts/create" className="flex items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-[12px] py-[8px] text-[13px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors">
            <PenTool size={16} />
            Write Post
          </Link>
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-[12px] py-[8px] text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
            <Settings size={16} />
            Table settings
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
              <th className="px-4 py-3 font-medium">Post Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Published Date</th>
              <th className="px-4 py-3 font-medium w-16 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border">
            {dummyPosts.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-cyber-surface-hover/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Square size={16} className="text-cyber-body-subtle" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 overflow-hidden rounded-md border border-cyber-border-subtle bg-cyber-surface-active shrink-0">
                      <Image
                        src={row.thumbnail}
                        alt={row.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-cyber-heading truncate max-w-[200px]">
                        {row.title}
                      </span>
                      <span className="text-[11px] text-cyber-body-subtle">
                        /{row.slug}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full border border-cyber-border-subtle shrink-0">
                      <Image
                        src={row.author.avatar}
                        alt={row.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-cyber-body font-medium">{row.author.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-0.5 text-[11px] font-medium text-cyber-body">
                    {row.category}
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
                  <div className="flex items-center gap-1.5 text-cyber-heading font-medium tabular-nums">
                    <Eye size={14} className="text-cyber-body-subtle" />
                    {row.views}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-cyber-heading font-medium">
                      <CalendarDays size={14} className="text-cyber-body-subtle" />
                      {row.date}
                    </div>
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
                          <Eye size={16} />
                          Preview
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
                          <Edit2 size={16} />
                          Edit
                        </button>
                        {row.status === "Published" ? (
                          <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
                            <Archive size={16} />
                            Unpublish
                          </button>
                        ) : (
                          <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-neon hover:bg-[rgba(84,234,253,0.1)] transition-colors">
                            <Send size={16} />
                            Publish Now
                          </button>
                        )}
                        <button className="flex w-full items-center gap-2 rounded-cyber p-2 text-[14px] font-medium text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors mt-1 border-t border-cyber-border pt-2">
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
            1–5 of 1,204
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
}
