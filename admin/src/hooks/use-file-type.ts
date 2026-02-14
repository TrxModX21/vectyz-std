import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { FileTypeSchema } from "@/validators/file-type.validation";

export const useGetFileTypes = () => {
  return useQuery<FileTypeResponse>({
    queryKey: ["file-types"],
    queryFn: async () => {
      const res = await api.get(`/file-types`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateFileType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FileTypeSchema) => {
      const payload = {
        ...data,
        supported_file_extension: data.supportedFileExtension,
        collection_image: data.collectionImage,
      };
      const response = await api.post("/file-types", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-types"] });
      toast.success("File Type created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create file type");
    },
  });
};

export const useUpdateFileType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FileTypeSchema }) => {
      const payload = {
        ...data,
        supported_file_extension: data.supportedFileExtension,
        collection_image: data.collectionImage,
      };
      const response = await api.put(`/file-types/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-types"] });
      toast.success("File Type updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update file type");
    },
  });
};

export const useDeleteFileType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/file-types/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["file-types"] });
      toast.success("File Type deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete file type");
    },
  });
};
