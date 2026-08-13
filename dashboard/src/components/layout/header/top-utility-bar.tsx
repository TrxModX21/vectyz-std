import { ChevronDown, Globe, Mail, Phone } from "lucide-react";
import HeaderDateTime from "./header-datetime";

const TopUtilityBar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 text-[11px] bg-cyber-surface-raised border border-cyber-border-subtle">
      {/* Left — Contact / Status */}
      <div className="hidden items-center gap-4 sm:flex">
        <span className="flex items-center gap-1.5 text-cyber-body-subtle">
          <Phone size={11} />
          +62 812-1081-9099
        </span>
        <span className="flex items-center gap-1.5 text-cyber-body-subtle">
          <Mail size={11} />
          ask@nadev.co.id
        </span>
      </div>

      {/* Right — Language, Time */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="flex items-center gap-1 px-2 py-0.5 transition-colors duration-150 text-cyber-body-subtle hover:text-cyber-heading">
          <Globe size={11} />
          EN
          <ChevronDown size={10} />
        </button>

        <HeaderDateTime />
      </div>
    </div>
  );
};

export default TopUtilityBar;
