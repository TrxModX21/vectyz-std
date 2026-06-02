import { useQuery } from "@tanstack/react-query";
import {
  GetMyDownloadHistoryParams,
  GetMyDownloadHistoryResponse,
} from "../../types/download";
import { api } from "@/lib/axios";

export const useGetDownloadMyHistoryList = (
  params: GetMyDownloadHistoryParams,
) => {
  return useQuery<GetMyDownloadHistoryResponse>({
    queryKey: ["myDownloadHistory", params],
    queryFn: async () => {
      const res = await api.get("/downloads/history", { params });
      return res.data;
    },
    staleTime: 1000 * 60 * 1440, // 1 hari
  });
};
