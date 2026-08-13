import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../../../types/api";
import type { MySessionsData } from "../../../types/session";
import { api } from "@/lib/axios";

export const useMySessions = () => {
  return useQuery<ApiResponse<MySessionsData>>({
    queryKey: ["sessions", "me"],
    queryFn: async () => {
      const res = await api.get("/sessions/me");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};
