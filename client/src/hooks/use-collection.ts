import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface MyCollectionsQueryProps {
  page?: number;
  limit?: number;
  search?: string;
}

export const useMyCollections = (query?: MyCollectionsQueryProps) => {
  return useQuery({
    queryKey: ["my-collections", query?.page, query?.limit, query?.search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.search) params.append("search", query.search);

      const res = await api.get(`/collections/me?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await api.post("/collections", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create collection");
    },
  });
};

export const useAddItemToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { collectionId: string; stockId: string }) => {
      const res = await api.post(`/collections/${data.collectionId}/items`, {
        stockId: data.stockId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
      toast.success("Added to collection!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to collection");
    },
  });
};
