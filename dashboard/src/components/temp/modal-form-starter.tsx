'use client';

import { Calendar, CheckCircle2, ChevronDown, Hash, Plus, Ruler, Tag, UploadCloud, X } from "lucide-react";
import { useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalFormStarter = ({ isOpen, onClose }: ModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="cyber-card clip-card flex flex-col w-full max-w-2xl max-h-[90vh] bg-cyber-surface shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 glow-neon"
        role="dialog"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border shrink-0">
          <h2 className="text-lg font-heading tracking-[1px] text-cyber-heading">
            Create Category
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-cyber text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-5">
            {/* Primary Name Input (2 cols) */}
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Category Name <span className="text-[#FF3366]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 3D Assets"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-[10px] text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Secondary Short Text (2 cols) */}
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Slug <span className="text-[#FF3366]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 3d-assets"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-[10px] text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Numeric Value Input (2 cols) */}
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Base Price / Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-[10px] text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle tabular-nums focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Category Select (2 cols) */}
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Parent Group
              </label>
              <div className="relative">
                <select className="w-full appearance-none rounded-cyber border border-cyber-border bg-cyber-surface-active pl-3 pr-10 py-[10px] text-[13px] text-cyber-heading focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all">
                  <option value="">None (Top Level)</option>
                  <option value="graphics">Graphics</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-cyber-body">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Four Compact Numeric Inputs (1 col each) */}
            <div className="col-span-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Priority
              </label>
              <div className="relative">
                <Hash
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
                />
                <input
                  type="number"
                  placeholder="0"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active py-[10px] pl-9 pr-3 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle tabular-nums focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="col-span-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Weight
              </label>
              <div className="relative">
                <Ruler
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
                />
                <input
                  type="number"
                  placeholder="1.0"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active py-[10px] pl-9 pr-3 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle tabular-nums focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="col-span-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Tax Rate
              </label>
              <div className="relative">
                <Tag
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
                />
                <input
                  type="number"
                  placeholder="%"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active py-[10px] pl-9 pr-3 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle tabular-nums focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="col-span-1 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Max Items
              </label>
              <div className="relative">
                <CheckCircle2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
                />
                <input
                  type="number"
                  placeholder="∞"
                  className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active py-[10px] pl-9 pr-3 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle tabular-nums focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Description Textarea (Full Width) */}
            <div className="col-span-1 sm:col-span-4 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief description about this category..."
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active p-[14px] text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle resize-none focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none transition-all"
              />
            </div>

            {/* Image Dropzone (Full Width) */}
            <div className="col-span-1 sm:col-span-4 flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-cyber-heading">
                Cover Image
              </label>
              <div className="flex flex-col items-center justify-center rounded-cyber border-2 border-dashed border-cyber-border bg-cyber-surface-active py-8 px-4 text-center transition-colors hover:border-neon hover:bg-[rgba(84,234,253,0.05)]">
                <UploadCloud size={32} className="text-neon mb-3" />
                <p className="text-[14px] font-medium text-cyber-heading mb-1">
                  Drag and drop your image here
                </p>
                <p className="text-[12px] text-cyber-body-subtle mb-4">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-[10px] text-[13px] font-medium text-neon transition-colors hover:bg-[rgba(84,234,253,0.2)]"
                >
                  Browse file
                </button>
              </div>
            </div>

            {/* Inline Radio Group (Full Width) */}
            <div className="col-span-1 sm:col-span-4 flex flex-col gap-2 mt-2">
              <label className="text-[13px] font-medium text-cyber-heading">
                Visibility Status
              </label>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-cyber-border bg-cyber-surface-active group-hover:border-neon">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <div className="w-2 h-2 rounded-full bg-neon opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[13px] text-cyber-body group-hover:text-cyber-heading">
                    Public
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-cyber-border bg-cyber-surface-active group-hover:border-neon">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      className="peer sr-only"
                    />
                    <div className="w-2 h-2 rounded-full bg-neon opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[13px] text-cyber-body group-hover:text-cyber-heading">
                    Private
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-cyber-border bg-cyber-surface-active group-hover:border-neon">
                    <input
                      type="radio"
                      name="visibility"
                      value="draft"
                      className="peer sr-only"
                    />
                    <div className="w-2 h-2 rounded-full bg-neon opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[13px] text-cyber-body group-hover:text-cyber-heading">
                    Draft
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-cyber-border bg-cyber-surface shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-cyber border border-neon bg-[rgba(84,234,253,0.1)] px-4 py-[10px] text-[13px] font-medium text-neon transition-colors hover:bg-[rgba(84,234,253,0.2)]">
              <Plus size={16} />
              Add item
            </button>
            <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-cyber border border-cyber-border bg-transparent px-4 py-[10px] text-[13px] font-medium text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <Calendar size={16} />
              Schedule
            </button>
          </div>
          <button
            onClick={onClose}
            className="flex w-full sm:w-auto items-center justify-center rounded-cyber border border-cyber-border bg-transparent px-4 py-[10px] text-[13px] font-medium text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalFormStarter;
