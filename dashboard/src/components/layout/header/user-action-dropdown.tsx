"use client";

import { useMySessions } from "@/features/session/queries";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, Shield, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CustomDialog } from "@/components/common/dialog";
import { toast } from "@/components/uitripled/notification-center-shadcnui";

const UserActionDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { data: sessionResponse, isLoading: sessionLoading } = useMySessions();
  const user = sessionResponse?.data;
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  if (sessionLoading) {
    return <UserActionDropdownSkeleton />;
  }

  const handleLogout = async () => {
    setIsPending(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setLogoutDialogOpen(false);
          //   toast.success("Logout berhasil!");
          router.replace("/");
          router.refresh();
        },
        onError: (ctx) => {
          setLogoutDialogOpen(false);
          toast.error(
            ctx.error.message || "Something went wrong, try again later!",
          );
        },
      },
    });
    setIsPending(false);
  };

  return (
    <div className="relative ml-1" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-[10px] transition-colors rounded-cyber hover:bg-cyber-surface-hover outline-none focus:ring-1 focus:ring-cyber-border"
      >
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-cyber-border">
          <Image
            src={user?.image || "/icon.png"}
            alt="User"
            fill
            sizes="32px"
            loading="eager"
            className="object-cover"
          />
        </div>
        <div className="hidden flex-col items-start lg:flex">
          <div className="flex items-center">
            <span className="text-xs font-medium leading-tight text-cyber-heading">
              {user?.name}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "ml-[6px] text-cyber-body-subtle transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
          <span className="text-[10px] leading-tight text-[#54EAFD]">
            ({user?.role})
          </span>
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[288px] overflow-hidden rounded-lg border border-cyber-border bg-cyber-surface-raised shadow-2xl z-50">
          {/* Profile Header */}
          <div className="p-2">
            <div className="flex items-center gap-[6px] rounded-md bg-cyber-surface-hover px-[10px] py-2">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-cyber-border">
                <Image
                  src={user?.image || "/icon.png"}
                  alt="Profile"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-medium leading-tight text-cyber-heading truncate">
                  {user?.name}
                </span>
                <span className="text-xs leading-tight text-cyber-body-subtle truncate">
                  {user?.email}
                </span>
              </div>
              {/* Status Badge */}
              <div className="ml-auto flex items-center rounded-sm border border-[#54EAFD]/30 bg-[#54EAFD]/10 px-[6px] py-[2px]">
                <span className="text-[10px] font-medium text-[#54EAFD]">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Menu List */}
          <div className="px-2 pb-2">
            <button className="flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <User size={16} />
              <span className="text-sm font-medium">Account</span>
            </button>
            <button className="flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <Settings size={16} />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button className="flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <Shield size={16} />
              <span className="text-sm font-medium">Privacy</span>
            </button>
            {/* <button className="flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <Bell size={16} />
              <span className="text-sm font-medium">Notifications</span>
            </button>
            <button className="flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <HelpCircle size={16} />
              <span className="text-sm font-medium">Help center</span>
            </button> */}

            {/* Dark Mode Toggle Row */}
            {/* <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="mt-1 mb-1.5 flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading"
            >
              <Moon size={16} />
              <span className="text-sm font-medium">Dark mode</span>
              <div
                className={cn(
                  "relative ml-auto h-5 w-9 rounded-full transition-colors",
                  isDarkMode ? "bg-[#54EAFD]" : "bg-cyber-surface-hover"
                )}
              >
                <div
                  className={cn(
                    "absolute top-[2px] h-4 w-4 rounded-full bg-white transition-transform",
                    isDarkMode ? "translate-x-[18px]" : "translate-x-[2px]"
                  )}
                />
              </div>
            </button> */}

            {/* Divider */}
            <div className="mt-1 border-t border-cyber-border pt-1.5" />

            {/* <button className="flex w-full items-center gap-[6px] rounded-md p-2 text-cyber-body transition-colors hover:bg-cyber-surface-hover hover:text-cyber-heading">
              <Star size={16} />
              <span className="text-sm font-medium">Upgrade to PRO</span>
            </button> */}

            <button
              onClick={() => {
                setLogoutDialogOpen(true);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-[6px] rounded-md p-2 text-[#FF003C] transition-colors hover:bg-[#FF003C]/10"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      )}

      <CustomDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        isLoading={isPending}
        title="Confirm Logout"
        description="This will end your current session and you will need to log in again to access your account."
        cancelText="Cancel"
        confirmText="Logout"
        destructive={true}
        onCancel={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

const UserActionDropdownSkeleton = () => (
  <div className="flex items-center gap-2 ml-1 px-4 py-[10px]">
    <div className="h-8 w-8 shrink-0 rounded-full border border-cyber-border bg-cyber-body/30 animate-pulse" />
    <div className="hidden flex-col lg:flex gap-1">
      <div className="h-3 w-20 bg-cyber-body/30 animate-pulse rounded-sm" />
      <div className="h-2 w-12 bg-[#54EAFD]/20 animate-pulse rounded-sm" />
    </div>
  </div>
);

export default UserActionDropdown;
