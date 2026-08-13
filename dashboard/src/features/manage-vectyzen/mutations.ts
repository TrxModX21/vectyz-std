import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useToggleOfficialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isOfficial,
    }: {
      id: string;
      isOfficial: boolean;
    }) => {
      const res = await api.patch(
        `/admin/manage-vectyzen/toggle-official/${id}`,
        { isOfficial }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-vectyzen"] });
    },
  });
};

export const useBanVectyzenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      banned,
      banReason,
      banExpires,
    }: {
      id: string;
      banned: boolean;
      banReason?: string | null;
      banExpires?: string | null;
    }) => {
      const res = await api.patch(`/admin/manage-vectyzen/ban/${id}`, {
        banned,
        banReason,
        banExpires,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-vectyzen"] });
    },
  });
};

export const useDeleteVectyzenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/manage-vectyzen/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-vectyzen"] });
    },
  });
};

export const useBulkDeleteVectyzenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.post("/admin/manage-vectyzen/bulk-delete", {
        ids,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-vectyzen"] });
    },
  });
};
