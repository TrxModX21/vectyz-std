import { api } from "@/lib/axios";
import {
  CreateBlogCategorySchema,
  CreateBlogTagSchema,
  UpdateBlogCategorySchema,
  UpdateBlogTagSchema,
} from "@/validators/manage-blogs.validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ==========================================
// SETTINGS MUTATIONS
// ==========================================
export const useUpdateBlogSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const res = await api.patch("/admin/manage-blog/settings", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-settings"] });
    },
  });
};

// ==========================================
// CATEGORY MUTATIONS
// ==========================================
export const useCreateBlogCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBlogCategorySchema) => {
      const res = await api.post("/admin/manage-blog/categories", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-categories"] });
    },
  });
};

export const useUpdateBlogCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBlogCategorySchema;
    }) => {
      const res = await api.patch(`/admin/manage-blog/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-categories"] });
    },
  });
};

export const useDeleteBlogCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/manage-blog/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-categories"] });
    },
  });
};

// ==========================================
// TAG MUTATIONS
// ==========================================
export const useCreateBlogTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBlogTagSchema) => {
      const res = await api.post("/admin/manage-blog/tags", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-tags"] });
    },
  });
};

export const useUpdateBlogTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateBlogTagSchema;
    }) => {
      const res = await api.patch(`/admin/manage-blog/tags/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-tags"] });
    },
  });
};

export const useDeleteBlogTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/manage-blog/tags/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-tags"] });
    },
  });
};

// ==========================================
// BLOG POST MUTATIONS
// ==========================================
export const useCreateBlogPostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/admin/manage-blog/posts", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-blog-posts"] });
    },
  });
};
