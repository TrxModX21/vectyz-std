"use client";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const ColorPicker = ({
  value,
  onChange,
  disabled,
  className,
}: ColorPickerProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      <div className="size-10 rounded-md border shadow-sm shrink-0 overflow-hidden relative">
        <input
          type="color"
          className="absolute inset-0 w-[150%] h-[150%] top-[-25%] left-[-25%] p-0 border-0 cursor-pointer disabled:cursor-not-allowed"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Input
        placeholder="#000000"
        value={value}
        className="flex-1 font-mono uppercase"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        maxLength={7}
      />
    </div>
  );
};

export default ColorPicker;
