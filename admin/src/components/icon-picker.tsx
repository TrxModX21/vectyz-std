"use client";

import { useState, useMemo } from "react";
import * as TablerIcons from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, SearchIcon, ChevronsUpDown } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const IconPicker = ({ value, onChange, disabled }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconList = useMemo(() => {
    return Object.keys(TablerIcons).filter((key) => {
      // Filter out non-component exports
      // Must start with Uppercase (PascalCase component)
      // Ignore "default", "createReactComponent", etc.
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {SelectedIcon ? (
            <div className="flex items-center gap-2">
              <SelectedIcon className="size-4" />
              <span>{value}</span>
            </div>
          ) : (
            "Select icon..."
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="p-2 sticky top-0 bg-popover z-10 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icon..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 w-full max-h-[300px] overflow-y-auto p-2">
          {displayIcons.map((iconName) => {
            const Icon = TablerIcons[
              iconName as keyof typeof TablerIcons
            ] as React.ElementType;
            return (
              <Button
                key={iconName}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center justify-center p-2 h-auto gap-1 hover:bg-muted",
                  value === iconName && "bg-muted"
                )}
                onClick={() => {
                  onChange(iconName);
                  setOpen(false);
                }}
              >
                <Icon className="size-6" />
                <span className="text-[10px] truncate max-w-full">
                  {iconName}
                </span>
                {value === iconName && (
                  <CheckIcon className="absolute top-1 right-1 size-3 text-primary" />
                )}
              </Button>
            );
          })}
          {displayIcons.length === 0 && (
            <div className="col-span-4 text-center text-sm text-muted-foreground py-4">
              No icons found.
            </div>
          )}
        </div>
        <div className="p-2 text-xs text-center text-muted-foreground border-t">
          Showing {displayIcons.length} of {iconList.length} icons
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
