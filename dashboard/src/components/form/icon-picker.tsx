"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import * as TablerIcons from "@tabler/icons-react";
import { Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const IconPicker = ({ value, onChange, disabled, error }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const iconList = useMemo(() => {
    return Object.keys(TablerIcons).filter((key) => {
      if (
        key === "default" ||
        key === "createReactComponent" ||
        !/^[A-Z]/.test(key)
      ) {
        return false;
      }
      return key.toLowerCase().includes(search.toLowerCase());
    });
  }, [search]);

  // Display only first 100 to avoid lag
  const displayIcons = iconList.slice(0, 100);

  const SelectedIcon = value
    ? (TablerIcons[value as keyof typeof TablerIcons] as React.ElementType)
    : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-[10px] text-[13px] text-cyber-heading transition-colors clip-input focus:border-[#54EAFD] focus:ring-1 focus:ring-[#54EAFD]",
          disabled && "cursor-not-allowed opacity-50",
          error
            ? "border-[#FF003C] focus:border-[#FF003C] focus:ring-[#FF003C]"
            : "border-cyber-border",
        )}
      >
        {SelectedIcon ? (
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4 text-neon" />
            <span className="truncate">{value}</span>
          </div>
        ) : (
          <span className="text-cyber-body-subtle">Select icon...</span>
        )}
        <ChevronDown
          size={16}
          className="text-cyber-body-subtle shrink-0 ml-2"
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 flex max-h-[300px] w-full min-w-[300px] flex-col overflow-hidden rounded-cyber border border-cyber-border bg-cyber-surface shadow-xl glow-neon animate-in fade-in zoom-in-95">
          {/* Search Header */}
          <div className="border-b border-cyber-border p-2 shrink-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
              />
              <input
                type="text"
                placeholder="Search icon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-cyber border border-cyber-border bg-cyber-surface-active px-[10px] py-[6px] pl-8 text-[12px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Icons Grid */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-4 gap-2">
              {displayIcons.map((iconName) => {
                const Icon = TablerIcons[
                  iconName as keyof typeof TablerIcons
                ] as React.ElementType;
                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1 rounded-cyber border p-2 h-auto transition-colors focus:outline-none",
                      isSelected
                        ? "border-neon bg-[rgba(84,234,253,0.1)] text-neon"
                        : "border-transparent text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading",
                    )}
                    title={iconName}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="w-full truncate text-center text-[10px]">
                      {iconName}
                    </span>
                    {isSelected && (
                      <Check
                        size={12}
                        className="absolute right-1 top-1 text-neon"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {displayIcons.length === 0 && (
              <div className="py-6 text-center text-[12px] text-cyber-body-subtle">
                No icons found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-cyber-border p-2 text-center text-[11px] text-cyber-body-subtle shrink-0">
            Showing {displayIcons.length} of {iconList.length} icons
          </div>
        </div>
      )}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#FF003C]">{error}</p>
      )}
    </div>
  );
};

export default IconPicker;
