import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin" | "reviewer";
  isPremium: boolean;
  creditBalance: number;
  premiumQuota: number;
}

export const useAuth = () => {
  return useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
