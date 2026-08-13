"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, id, required, icon: Icon, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

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
            type={showPassword ? "text" : "password"}
            required={required}
            ref={ref}
            className={cn(
              "w-full border bg-cyber-surface-hover py-2.5 pr-10 text-sm text-cyber-heading placeholder:text-cyber-body-subtle outline-none transition-all duration-150 clip-input rounded-cyber focus:border-[#54EAFD] focus:ring-1 focus:ring-[#54EAFD]",
              Icon ? "pl-10" : "pl-3",
              error ? "border-[#FF003C] focus:border-[#FF003C] focus:ring-[#FF003C]" : "border-cyber-border",
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-cyber-body transition-colors duration-150 hover:text-cyber-heading"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-medium text-[#FF003C]">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
