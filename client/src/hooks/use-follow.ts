import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFollowStatus = (authorId?: string) => {
  return useQuery<{ isFollowing: boolean }>({
    queryKey: ["followStatus", authorId],
    queryFn: async () => {
      if (!authorId) return { isFollowing: false };
      const res = await api.get(`/users/${authorId}/follow-status`);
      return res.data;
    },
    enabled: !!authorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useToggleFollow = (authorId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isCurrentlyFollowing: boolean) => {
      if (!authorId) throw new Error("Author ID required");
      if (isCurrentlyFollowing) {
        // Unfollow
        const res = await api.delete(`/users/${authorId}/follow`);
        return res.data;
      } else {
        // Follow
        const res = await api.post(`/users/${authorId}/follow`);
        return res.data;
      }
    },
    onMutate: async (isCurrentlyFollowing: boolean) => {
      if (!authorId) return;

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["followStatus", authorId] });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData<{ isFollowing: boolean }>([
        "followStatus",
        authorId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["followStatus", authorId], {
        isFollowing: !isCurrentlyFollowing,
      });

      // Return a context object with the snapshotted value
      return { previousStatus };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err: any, variables, context: any) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["followStatus", authorId],
          context.previousStatus
        );
      }
      toast.error(err.response?.data?.message || "Failed to update follow status");
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["followStatus", authorId] });
      // Invalidate stock detail so the totalFollowers count updates from server
      queryClient.invalidateQueries({ queryKey: ["stockDetail"] });
      // Also invalidate user detail if they are on author profile
      queryClient.invalidateQueries({ queryKey: ["userDetail"] }); 
      queryClient.invalidateQueries({ queryKey: ["vectyzenDetail"] }); 
    },
  });
};
