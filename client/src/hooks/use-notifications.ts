import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/axios";

export const useNotifications = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // 1. Fetch Unread Count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count");
      return res.data.count as number;
    },
    enabled: !!session?.user?.id,
  });

  // 2. Fetch Notifications List (Infinite Scroll)
  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notifications", "list"],
    queryFn: async ({ pageParam = undefined }) => {
      const res = await api.get("/notifications", {
        params: { limit: 10, cursor: pageParam },
      });
      return res.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    enabled: !!session?.user?.id,
  });

  // 3. Listen to Socket Events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      // Show toast
      toast.info(notification.title, {
        description: notification.message,
      });

      // Update React Query Cache
      queryClient.setQueryData(["notifications", "unread-count"], (old: number = 0) => old + 1);
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket, queryClient]);

  // 4. Mark As Read Mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    unreadCount,
    notifications: notificationsData?.pages.flatMap((page) => page.notifications) || [],
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
