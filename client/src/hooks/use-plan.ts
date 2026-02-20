import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAllPlans = () => {
  return useQuery<PlansResponse>({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await api.get("/plans");
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

export const useGetPlanDetail = (planId: string) => {
  return useQuery<PlanDetailResponse>({
    queryKey: ["plan", planId],
    queryFn: async () => {
      const res = await api.get(`/plans/${planId}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
