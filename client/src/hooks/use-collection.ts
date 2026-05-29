import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetMyCollectionResponse } from "../../types/collection";

export interface MyCollectionsQueryProps {
  page?: number;
  limit?: number;
  search?: string;
}

export const useMyCollections = (query?: MyCollectionsQueryProps) => {
  return useQuery<GetMyCollectionResponse>({
    queryKey: ["my-collections", query?.page, query?.limit, query?.search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.search) params.append("search", query.search);

      const res = await api.get(`/collections/me?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
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
      toast.error(
        error.response?.data?.message || "Failed to create collection",
      );
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
      queryClient.invalidateQueries({ queryKey: ["check-stock-collections", variables.stockId] });
      toast.success("Added to collection!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add to collection",
      );
    },
  });
};

export const useCollectionBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["collection", slug],
    queryFn: async () => {
      const res = await api.get(`/collections/slug/${slug}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useCollectionItemsBySlug = (
  slug: string,
  query?: { page?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ["collection-items", slug, query?.page, query?.limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());

      const res = await api.get(
        `/collections/slug/${slug}/items?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name?: string; description?: string; isPrivate?: boolean }) => {
      const { id, ...updateData } = data;
      const res = await api.put(`/collections/${id}`, updateData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      queryClient.invalidateQueries({ queryKey: ["collection-items"] });
      toast.success("Collection updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update collection",
      );
    },
  });
};

export const useCheckStockCollections = (stockId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["check-stock-collections", stockId],
    queryFn: async () => {
      const res = await api.get(`/collections/check-stock/${stockId}`);
      return res.data?.collections || [];
    },
    enabled: !!stockId && enabled,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useRemoveItemFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { collectionId: string; stockId: string }) => {
      const res = await api.delete(`/collections/${data.collectionId}/items/${data.stockId}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection-items"] });
      queryClient.invalidateQueries({ queryKey: ["check-stock-collections", variables.stockId] });
      toast.success("Removed from collection!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove from collection",
      );
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) => {
      const res = await api.delete(`/collections/${collectionId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      toast.success("Collection deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete collection",
      );
    },
  });
};
