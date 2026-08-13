"use client";

import { Save, Image as ImageIcon, Globe, Server, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export function SeoSettingsView() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl pb-10">
      
      {/* Search Engine Optimization */}
      <section className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-border pb-4">
          <Globe className="text-neon" size={20} />
          <h3 className="text-lg font-medium text-cyber-heading">Search Engine Optimization</h3>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-cyber-heading">
              Default SEO Title Suffix
            </label>
            <input
              type="text"
              defaultValue=" | Vectolio Blog"
              className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-cyber-body-subtle">
              Appended to all blog post titles (e.g. "My Article | Vectolio Blog")
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-cyber-heading">
              Global Meta Description
            </label>
            <textarea
              rows={3}
              defaultValue="Discover the best UI design trends, digital assets, and development tutorials on Vectolio."
              className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors resize-none"
            />
            <p className="text-[11px] text-cyber-body-subtle">
              Used as a fallback when an article lacks a specific meta description.
            </p>
          </div>
        </div>
      </section>

      {/* Social Media & Open Graph */}
      <section className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-border pb-4">
          <Hash className="text-[#FF3366]" size={20} />
          <h3 className="text-lg font-medium text-cyber-heading">Social Media (Open Graph)</h3>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-cyber-heading">
              Default Open Graph Image
            </label>
            <div className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-cyber border-2 border-dashed border-cyber-border bg-cyber-surface-active p-6 text-center transition-colors hover:border-[#FF3366] hover:bg-cyber-surface-hover">
              <ImageIcon size={24} className="mb-2 text-cyber-body-subtle" />
              <p className="text-[13px] font-medium text-cyber-heading">
                Upload default OG Image
              </p>
              <p className="mt-1 max-w-xs text-[11px] text-cyber-body-subtle">
                Used when a post doesn't have a featured image. Recommended: 1200x630px
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Preferences */}
      <section className="cyber-card clip-card flex flex-col p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-border pb-4">
          <Server className="text-cyber-heading" size={20} />
          <h3 className="text-lg font-medium text-cyber-heading">Content Preferences</h3>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 rounded-cyber border border-cyber-border bg-cyber-surface-active">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-cyber-heading">Enable Comments</span>
              <span className="text-[11px] text-cyber-body-subtle">Allow users to leave comments on published posts.</span>
            </div>
            {/* Custom Toggle Switch */}
            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-[rgba(84,234,253,0.3)] transition-colors">
              <span className="inline-block h-4 w-4 translate-x-4 transform rounded-full bg-neon shadow glow-neon transition-transform" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-cyber border border-cyber-border bg-cyber-surface-active">
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-cyber-heading">Auto-publish Scheduled Posts</span>
              <span className="text-[11px] text-cyber-body-subtle">Requires CRON jobs to be properly configured.</span>
            </div>
            <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-cyber-border transition-colors">
              <span className="inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-cyber-body-subtle transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button className="rounded-cyber border border-cyber-border bg-transparent px-4 py-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
          Discard Changes
        </button>
        <button className="flex items-center gap-2 rounded-cyber border-none bg-neon px-6 py-2 text-[13px] font-bold text-[#04040A] hover:bg-[#3DC8DB] transition-all">
          <Save size={16} />
          Save Configuration
        </button>
      </div>

    </div>
  );
}
