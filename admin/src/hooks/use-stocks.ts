import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetStock = (id: string) => {
  return useQuery<GetDetailStockResponse>({
    queryKey: ["stock", id],
    queryFn: async () => {
      const res = await api.get(`/stocks/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetStocks = (params: GetStocksParams) => {
  return useQuery<GetStocksResponse>({
    queryKey: ["stocks", params],
    queryFn: async () => {
      const res = await api.get("/stocks", { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateStockStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
      rejectionReason?: string;
    }) => {
      const res = await api.patch(`/stocks/${id}/status`, {
        status,
        rejectionReason,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update stock status",
      );
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.put(`/stocks/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update stock");
    },
  });
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/stocks", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create stock");
    },
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Assuming DELETE endpoint exists or will exist.
      // If not, I might need to add it to backend too.
      // Checking backend routes... I only added GET and POST.
      // I need to add DELETE and PATCH/PUT to backend.
      const res = await api.delete(`/stocks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete stock");
    },
  });
};
