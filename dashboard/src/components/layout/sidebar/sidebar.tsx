"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  ChevronDown,
  PlusCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/const/sidebar-item";
import UserProfileBlock from "./user-profile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 flex h-dvh w-64 flex-col border-r transition-transform duration-200 ease-out lg:translate-x-0 bg-sidebar border-cyber-border",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close button — mobile */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 lg:hidden text-cyber-body"
        >
          <X size={20} />
        </button>

        <UserProfileBlock />

        {/* ── Icon Utility Row ── */}
        <div className="mx-4 flex items-center justify-center gap-3 border-t border-b py-3 my-2 border-cyber-border">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: Settings, label: "Settings" },
            { icon: HelpCircle, label: "Help" },
          ].map((item) => (
            <button
              key={item.label}
              title={item.label}
              className="flex h-9 w-9 items-center justify-center rounded-sm transition-all duration-150 ease-out text-cyber-body bg-transparent hover:bg-cyber-surface-hover hover:text-cyber-heading"
            >
              <item.icon size={18} />
            </button>
          ))}
        </div>

        <PrimaryNavigation />

        {/* ── Bottom Section — Settings + Upgrade Card ── */}
        <div className="px-3 pb-4">
          <button className="flex w-full items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all duration-150 ease-out rounded-cyber text-cyber-body bg-transparent hover:bg-cyber-surface-hover hover:text-cyber-heading">
            <Settings size={20} />
            <span>Settings</span>
          </button>

          {/* Add Stock CTA Card */}
          <div className="mt-3 p-4 clip-card bg-cyber-brand-soft border border-[rgba(84,234,253,0.15)] rounded-cyber">
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle size={16} className="text-[#54EAFD]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#54EAFD]">
                Add Stock
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-cyber-body">
              Upload and manage your new digital assets easily.
            </p>
            <button className="mt-3 w-full py-1.5 text-[11px] font-medium uppercase tracking-wider transition-all duration-150 ease-out clip-button bg-[#54EAFD] text-[#04040A] border-none rounded-cyber hover:bg-[#3DC8DB]">
              Upload New
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

const PrimaryNavigation = () => {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    // Automatically expand the parent menu if a child is the active route
    const activeParent = navItems.find((item) =>
      item.children?.some(
        (child) => child.href !== "#" && pathname === child.href,
      ),
    );
    if (activeParent) {
      setExpandedItem(activeParent.label);
    }
  }, [pathname]);

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const hasChildren = !!item.children;
          const isExpanded = expandedItem === item.label;
          const isChildActive = item.children?.some(
            (child) => child.href !== "#" && pathname === child.href,
          );
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : (item.href !== "#" && pathname.startsWith(item.href)) ||
                isChildActive;

          return (
            <li key={item.label}>
              {hasChildren ? (
                <button
                  onClick={() =>
                    setExpandedItem(isExpanded ? null : item.label)
                  }
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all duration-150 ease-out rounded-cyber hover:bg-cyber-surface-hover hover:text-cyber-heading bg-transparent",
                    isActive
                      ? "text-[#54EAFD]! bg-cyber-surface-active border-2 border-[#54EAFD]"
                      : "bg-transparent border-2 border-transparent",
                    isExpanded && !isActive
                      ? "text-cyber-heading"
                      : !isActive && "text-cyber-body",
                  )}
                >
                  <item.icon size={20} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-150",
                      isExpanded ? "rotate-180" : "rotate-0",
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all duration-150 ease-out rounded-cyber hover:bg-cyber-surface-hover hover:text-cyber-heading bg-transparent",
                    isActive
                      ? "text-[#54EAFD]! bg-cyber-surface-active border-2 border-[#54EAFD]"
                      : "bg-transparent border-2 border-transparent text-cyber-body",
                  )}
                >
                  <item.icon size={20} />
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && isExpanded && (
                <ul className="ml-5 mt-1 flex flex-col gap-0.5 border-l pl-4 py-1 border-cyber-border">
                  {item.children!.map((child) => {
                    const childActive =
                      child.href !== "#" && pathname === child.href;
                    return (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block px-3 py-1.5 text-xs transition-all duration-150 ease-out rounded-cyber hover:bg-cyber-surface-hover",
                            childActive
                              ? "text-[#54EAFD] bg-cyber-surface-active font-semibold"
                              : "text-cyber-body bg-transparent hover:text-cyber-heading",
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
