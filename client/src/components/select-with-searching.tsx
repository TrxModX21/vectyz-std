"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectWithSearchingProps<T> {
  items: T[];
  value?: string;
  onValueChange: (value: string) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SelectWithSearching<T>({
  items,
  value,
  onValueChange,
  getLabel,
  getValue,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
  disabled,
}: SelectWithSearchingProps<T>) {
  const [search, setSearch] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      getLabel(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, getLabel]);

  // Reset search when dropdown closes or value changes?
  // Usually better to keep search state independent or reset on open change if we had access to it.
  // For now, simple implementation.

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            className="h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {filteredItems.map((item) => (
            <SelectItem key={getValue(item)} value={getValue(item)}>
              {getLabel(item)}
            </SelectItem>
          ))}
          {filteredItems.length === 0 && (
            <div className="p-2 text-sm text-muted-foreground text-center">
              No results found
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
