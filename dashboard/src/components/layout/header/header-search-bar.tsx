import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

const HeaderSearchBar = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="relative hidden md:block">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-body z-10"
      />
      <input
        type="text"
        placeholder="Search…"
        className={cn(
          "w-56 py-1.5 pl-9 pr-3 text-xs outline-none transition-all duration-150 clip-input bg-cyber-surface-hover border text-cyber-heading rounded-cyber",
          searchFocused ? "border-[#54EAFD]" : "border-cyber-border",
        )}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />
    </div>
  );
};

export default HeaderSearchBar;
