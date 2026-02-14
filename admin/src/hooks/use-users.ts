import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useGetUsers = (params?: GetUsersParams) => {
  return useQuery<GetUsersResponse>({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await api.get(`/users`, { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetUser = (userId: string) => {
  return useQuery<{ user: User }>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason?: string;
    }) => {
      const response = await api.post(`/users/${userId}/ban`, { reason });
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update user status",
      );
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      role: "user" | "admin";
    }) => {
      const response = await api.post("/users", userData);
      return response.data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create user"
      );
    },
  });
};
