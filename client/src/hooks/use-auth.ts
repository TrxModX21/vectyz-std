import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export const useAuth = () => {
  return useQuery<GetMyProfileResponse | null>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
