import { api } from "@/lib/axios";
import { UpdateProfileBioShcema } from "@/validators/profile.validator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { image: string }) => {
      await api.put("/profile/avatar", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update avatar image",
      );
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { image: string }) => {
      await api.put("/profile/banner", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update banner image",
      );
    },
  });
};

export const useUpdateProfileBio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileBioShcema) => {
      await api.put("/profile/bio", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update bio");
    },
  });
};

export const useCheckUsernameAvailable = (
  isUsernameChanged: boolean,
  username: string,
) => {
  return useQuery({
    queryKey: ["checkUsername", username],
    queryFn: async () => {
      const res = await api.get(`/profile/check-username?username=${username}`);

      return res.data.available as boolean;
    },
    enabled: isUsernameChanged && username.length >= 3,
  });
};

export const useUpdateNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { newsletter: boolean }) => {
      await api.patch("/profile/newsletter", data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["authUser"] });
      const previousUser = queryClient.getQueryData<any>(["authUser"]);

      if (previousUser?.user) {
        queryClient.setQueryData<any>(["authUser"], {
          ...previousUser,
          user: {
            ...previousUser.user,
            profile: {
              ...(previousUser.user.profile || {}),
              newsletter: newData.newsletter,
            },
          },
        });
      }

      return { previousUser };
    },
    onError: (err, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["authUser"], context.previousUser);
      }
      toast.error("Failed to update newsletter preference");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
};
