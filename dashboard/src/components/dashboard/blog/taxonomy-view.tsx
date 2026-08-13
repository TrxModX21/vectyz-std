"use client";

import { useState } from "react";
import { Plus, Tag, FolderTree, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: 1, name: "Design", slug: "design", count: 24 },
  { id: 2, name: "Tutorials", slug: "tutorials", count: 18 },
  { id: 3, name: "Inspiration", slug: "inspiration", count: 42 },
  { id: 4, name: "Development", slug: "development", count: 12 },
];

const tags = [
  { id: 1, name: "UI/UX", count: 15 },
  { id: 2, name: "Figma", count: 8 },
  { id: 3, name: "Cyberpunk", count: 22 },
  { id: 4, name: "CSS", count: 10 },
  { id: 5, name: "React", count: 5 },
  { id: 6, name: "Trends 2026", count: 3 },
];

export function TaxonomyView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Categories Card */}
      <div className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FolderTree className="text-neon" size={20} />
            <h3 className="text-lg font-medium text-cyber-heading">Categories</h3>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-3 py-1.5 text-[12px] font-medium text-neon hover:bg-[rgba(84,234,253,0.2)] transition-colors">
            <Plus size={14} />
            Add Category
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-cyber border border-cyber-border bg-cyber-surface-active p-3 transition-colors hover:border-neon">
              <div className="flex flex-col">
                <span className="font-medium text-cyber-heading text-[13px]">{cat.name}</span>
                <span className="text-[11px] text-cyber-body-subtle">/{cat.slug}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-cyber-body bg-cyber-surface px-2 py-1 rounded-full tabular-nums border border-cyber-border-subtle">
                  {cat.count} posts
                </span>
                <button className="text-cyber-body hover:text-cyber-heading transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Card */}
      <div className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Tag className="text-[#FF3366]" size={20} />
            <h3 className="text-lg font-medium text-cyber-heading">Tags</h3>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-cyber border border-[#FF3366] bg-[rgba(255,51,102,0.1)] px-3 py-1.5 text-[12px] font-medium text-[#FF3366] hover:bg-[rgba(255,51,102,0.2)] transition-colors">
            <Plus size={14} />
            Add Tag
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="group flex items-center gap-2 rounded-full border border-cyber-border bg-cyber-surface-active px-3 py-1.5 transition-colors hover:border-[#FF3366]">
              <span className="text-[13px] font-medium text-cyber-heading">{tag.name}</span>
              <span className="text-[11px] text-cyber-body-subtle tabular-nums">({tag.count})</span>
              <button className="hidden group-hover:block ml-1 text-cyber-body-subtle hover:text-[#FF3366] transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  )
}
