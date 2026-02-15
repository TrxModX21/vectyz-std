import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface GetAllColorResponse {
  message: string;
  colors: Color[];
  totalCount: number;
}

export interface Color {
  id: string;
  name: string;
  slug: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const useGetColors = () => {
  return useQuery<GetAllColorResponse>({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await api.get("/colors");
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
