import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, required, icon: Icon, error, ...props }, ref) => {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-[13px] font-medium uppercase tracking-wider text-cyber-heading"
          >
            {label}
            {required && <span className="ml-1 text-[#FF003C]">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-cyber-body"
            />
          )}
          <input
            id={id}
            required={required}
            ref={ref}
            className={cn(
              "w-full border bg-cyber-surface-active py-2.5 pr-3 text-sm text-cyber-heading placeholder:text-cyber-body-subtle outline-none transition-all duration-150 clip-input rounded-cyber focus:border-[#54EAFD] focus:ring-1 focus:ring-[#54EAFD]",
              Icon ? "pl-10" : "pl-3",
              error ? "border-[#FF003C] focus:border-[#FF003C] focus:ring-[#FF003C]" : "border-cyber-border",
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-[#FF003C]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
