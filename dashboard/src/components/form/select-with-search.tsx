import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  onSearch: (term: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  fallbackLabel?: string;
}

const SelectWithSearch = ({
  value,
  onChange,
  options,
  onSearch,
  isLoading,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  disabled,
  fallbackLabel,
}: SelectWithSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || fallbackLabel || placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-cyber border border-cyber-border bg-cyber-surface-active px-3 py-2 text-[14px] text-cyber-heading focus:border-neon focus:outline-none transition-colors disabled:opacity-50"
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          size={16}
          className={`text-cyber-body-subtle transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 rounded-[2px] border border-cyber-border-subtle bg-cyber-surface-active shadow-[0_0_15px_rgba(84,234,253,0.1)] overflow-hidden"
          style={{
            clipPath:
              "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-cyber-border-subtle bg-cyber-surface-active">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyber-body-subtle"
              />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-sm border border-cyber-border bg-cyber-surface px-2.5 py-1.5 pl-8 text-[13px] text-cyber-heading placeholder:text-cyber-body-subtle focus:border-neon focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto p-1.5">
            {isLoading ? (
              <div className="flex items-center justify-center p-4 text-cyber-body-subtle">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-[13px] font-medium transition-colors ${
                    value === option.value
                      ? "bg-cyber-surface-active text-cyber-heading"
                      : "text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && (
                    <Check size={14} className="text-neon shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-[13px] text-cyber-body-subtle">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectWithSearch;
