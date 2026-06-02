"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { File, Stock } from "../../../../types/download";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/use-auth";
import { useCheckAccess } from "@/hooks/use-transactions";

interface DownloadButtonProps {
  stock: Stock;
}

const DownloadButton = ({ stock }: DownloadButtonProps) => {
  const [downloading, setDownloading] = useState(false);

  if (!stock) return null;

  const { data: userProfileResponse, isLoading: userDataLoading } = useAuth();
  const user = userProfileResponse?.user;

  const { data: access, isLoading: checkingAccess } = useCheckAccess(
    stock.id,
    !!user,
  );
  const hasAccess = access?.allowed;
  const isLoading = userDataLoading || checkingAccess;

  const handleDownload = async () => {
    try {
      setDownloading(true);

      if (!user) {
        toast.error(
          "Failed to initialize download session, your not the owner of this asset",
        );
        setDownloading(false);
        return;
      }

      const response = await api.post(
        `/downloads/${stock.id}`,
        {},
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stock.slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success("Download started!");
    } catch (error: any) {
      let message = "Failed to download";

      // Periksa apakah response data adalah Blob
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const json = JSON.parse(text);
          message = json.message || json.reason || message;
        } catch (e) {
          // Jika gagal di-parse, tetap biarkan default message
        }
      } else {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setDownloading(false);
    }
  };

  return hasAccess ? (
    <div className="text-right">
      <Button
        size="sm"
        disabled={downloading || isLoading}
        onClick={handleDownload}
      >
        {downloading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <span className="flex gap-1 items-center justify-center">
            <Download className="mr-2 h-4 w-4" /> Download Again
          </span>
        )}
      </Button>
    </div>
  ) : null;
};

export default DownloadButton;
