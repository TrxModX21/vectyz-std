import { api } from "@/lib/axios";
import { CreateFileTypeSchema } from "@/validators/manage-filetype.validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateFiletypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFileTypeSchema) => {
      const res = await api.post("/admin/manage-filetypes/create", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-filetypes"] });
    },
  });
};

export const useUpdateFiletypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; data: any }) => {
      const res = await api.patch(
        `/admin/manage-filetypes/update/${payload.id}`,
        payload.data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-filetypes"] });
    },
  });
};

export const useDeleteFiletypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/manage-filetypes/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-filetypes"] });
    },
  });
};

export const useBulkDeleteFiletypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.post(`/admin/manage-filetypes/bulk-delete`, {
        ids,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-filetypes"] });
    },
  });
};

export const useChangeFiletypeVisibilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch(
        `/admin/manage-filetypes/change-visibility/${id}`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-filetypes"] });
    },
  });
};