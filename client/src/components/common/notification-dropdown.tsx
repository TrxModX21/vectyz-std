"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export const NotificationDropdown = ({ className }: { className?: string }) => {
  const {
    unreadCount,
    notifications,
    isLoading,
    fetchNextPage,
    hasNextPage,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-lg"
          variant="ghost"
          className={cn("hidden xl:flex relative", className)}
        >
          <Bell className="size-8 text-blue-900" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <DropdownMenuLabel className="p-0 font-semibold text-lg">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent"
              onClick={() => markAllAsRead()}
            >
              <Check className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground text-sm">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className={cn(
                    "flex flex-col gap-1 p-4 border-b last:border-b-0 cursor-default transition-colors hover:bg-slate-50",
                    !notif.isRead ? "bg-blue-50/50" : "",
                  )}
                  onClick={() => {
                    if (!notif.isRead) markAsRead(notif.id);
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-sm leading-tight text-slate-800">
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-snug">
                    {notif.message}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
              {hasNextPage && (
                <Button
                  variant="ghost"
                  className="w-full rounded-none py-3 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchNextPage();
                  }}
                >
                  Load More
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
