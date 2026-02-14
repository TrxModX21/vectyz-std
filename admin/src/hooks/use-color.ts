import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { ColorSchema } from "@/validators/color.validation";

export const useGetColors = () => {
  return useQuery<ColorsResponse>({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await api.get(`/colors`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ColorSchema) => {
      const response = await api.post("/colors", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast.success("Color created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create color");
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ColorSchema }) => {
      const response = await api.put(`/colors/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast.success("Color updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update color");
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/colors/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast.success("Color deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete color");
    },
  });
};
