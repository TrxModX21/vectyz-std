import Image from "next/image";
import { Menu } from "lucide-react";
import { ThemeChanger } from "../theme-changer";
import Link from "next/link";
import TopUtilityBar from "./top-utility-bar";
import HeaderSearchBar from "./header-search-bar";
import NotificationSystem from "./notification-system";
import UserActionDropdown from "./user-action-dropdown";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full">
      <TopUtilityBar />

      {/* ── Primary Navbar ── */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-cyber-surface border-b border-cyber-border">
        {/* Left — Menu toggle + Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center lg:hidden transition-colors duration-150 text-cyber-body border-2 hover:bg-cyber-surface-hover hover:text-cyber-heading"
          >
            <Menu size={20} />
          </button>

          <div className="hidden items-center gap-1.5 sm:flex">
            <Link
              href="https://vectolio.com"
              target="_blank"
              className="flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button bg-transparent text-cyber-body border-cyber-border hover:bg-cyber-surface-hover hover:text-cyber-heading"
            >
              Open Site
            </Link>
          </div>
        </div>

        {/* Center — Brand */}
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-7">
            <Image
              src="/icon.png"
              alt="Vectolio"
              fill
              sizes="28px"
              loading="eager"
              className="object-contain"
            />
          </div>
          <span className="text-base tracking-wider sm:block font-heading text-cyber-heading">
            VECTOLIO
          </span>
        </div>

        {/* Right — Search, Grid, Bell, Region, Theme, User */}
        <div className="flex items-center gap-2">
          <HeaderSearchBar />

          <NotificationSystem />

          <ThemeChanger />

          {/* User identity */}
          <UserActionDropdown />
        </div>
      </div>
    </header>
  );
}
