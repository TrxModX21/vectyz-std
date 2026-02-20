import { Download, Loader2, Lock, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/use-auth";
import {
  useCheckAccess,
  useBuyAssetCredit,
  useBuyAssetDirect,
} from "../../hooks/use-transactions";
import { priceToCredit, formatRupiah } from "../../lib/helpers";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/axios";

interface DownloadButtonProps {
  stock: {
    id: string;
    isPremium: boolean;
    price: number | string;
    isSubscriptionAccessible: boolean;
    slug: string;
  };
}

const DownloadButton = ({ stock }: DownloadButtonProps) => {
  const { data: userProfileResponse, isLoading } = useAuth();
  const user = userProfileResponse?.user;
  const { data: access, isLoading: checkingAccess } = useCheckAccess(
    stock.id,
    !!user,
  );

  const [downloading, setDownloading] = useState(false);
  const buyCreditMutation = useBuyAssetCredit();
  const buyDirectMutation = useBuyAssetDirect();

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.post(
        `/downloads/${stock.id}`,
        {},
        { responseType: "blob" },
      );

      // Create Blob URL
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stock.slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success("Download started!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to download");
    } finally {
      setDownloading(false);
    }
  };

  const handleBuyCredit = () => {
    if (!user) return toast.error("Please login first");

    // Konfirmasi dulu? Idealnya pakai Dialog Confirm.
    // Untuk simplifikasi kita langsung eksekusi, atau pakai window.confirm
    const priceCredit = priceToCredit(Number(stock.price));
    if (window.confirm(`Buy this asset for ${priceCredit} Credits?`)) {
      buyCreditMutation.mutate(stock.id);
    }
  };

  const handleBuyDirect = () => {
    if (!user) return toast.error("Please login first");
    buyDirectMutation.mutate(stock.id);
  };

  if (checkingAccess || isLoading) {
    return (
      <Button disabled size="lg" className="w-full h-14">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking access...
      </Button>
    );
  }

  // 1. Has Access (Owner / Free Daily / Premium Quota)
  if (access?.allowed) {
    return (
      <Button
        size="lg"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-v-green hover:bg-[#7CB342] text-white font-bold h-14 rounded-lg text-base shadow-md shadow-green-100 dark:shadow-none transition-all"
      >
        {downloading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Download className="mr-2 w-5 h-5" />
        )}
        {access.reason === "PURCHASED" ? "Download Again" : "Download Now"}
      </Button>
    );
  }

  // 2. No Access - Logic Tampilan
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Option A: Subscribe (If accessible via sub) */}
      {stock.isSubscriptionAccessible && (
        <Button
          size="lg"
          className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold h-12"
          onClick={() => (window.location.href = "/pricing")}
        >
          <Lock className="mr-2 h-4 w-4" />
          {user?.isPremium ? "Premium Quota Exceeded" : "Get Premium Access"}
        </Button>
      )}

      {/* Option B: Direct Purchase (Credit) */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-12 border-v-green text-v-green hover:bg-v-green/10"
          onClick={handleBuyCredit}
          disabled={buyCreditMutation.isPending}
        >
          {buyCreditMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Buy w/ Credits"
          )}
          <span className="block text-xs ml-1">
            ({priceToCredit(Number(stock.price))} C)
          </span>
        </Button>

        <Button
          variant="secondary"
          className="h-12"
          onClick={handleBuyDirect}
          disabled={buyDirectMutation.isPending}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy {formatRupiah(Number(stock.price))}
        </Button>
      </div>
    </div>
  );
};

export default DownloadButton;
