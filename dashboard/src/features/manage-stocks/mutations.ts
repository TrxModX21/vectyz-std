import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateStockMetadataSchema } from "@/validators/manage-stocks.validator";

export const useApproveStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/admin/manage-stocks/approve/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-stocks"] });
    },
  });
};

export const useRejectStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason?: string }) => {
      const res = await api.patch(`/admin/manage-stocks/reject/${id}`, { rejectionReason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-stocks"] });
    },
  });
};

export const useDeleteStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/manage-stocks/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-stocks"] });
    },
  });
};

export const useSaveStockMetadataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStockMetadataSchema }) => {
      const res = await api.patch(`/admin/manage-stocks/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-stocks"] });
    },
  });
};