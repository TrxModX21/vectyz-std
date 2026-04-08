import {
  Coffee,
  CreditCard,
  Crown,
  Download,
  Layers,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCheckAccess } from "@/hooks/use-transactions";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GiveCoffeeDialog from "./give-coffee-dialog";
import { cn } from "@/lib/utils";
import DirectBuyDialog from "./direct-buy-dialog";
import CreditPayDialog from "./credit-buy-dialog";

const ActionButton = ({ stock }: { stock: Stock }) => {
  const { data: userProfileResponse, isLoading } = useAuth();
  const user = userProfileResponse?.user;
  const { data: access, isLoading: checkingAccess } = useCheckAccess(
    stock.id,
    !!user,
  );

  const [downloading, setDownloading] = useState(false);

  const isFreeGuest = !user && !stock.isPremium;
  const hasAccess = access?.allowed || isFreeGuest;

  const router = useRouter();

  const handleDownload = async () => {
    try {
      setDownloading(true);

      if (!user) {
        try {
          await authClient.signIn.anonymous();
        } catch (err) {
          toast.error("Failed to initialize download session");
          setDownloading(false);
          return;
        }
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
      const message = error.response?.data?.message;

      if (message === "ANONYMOUS_LIMIT_REACHED") {
        toast.error(
          "Download limit reached! Please create an account to continue.",
        );
        router.push("/auth/sign-up");
      } else {
        toast.error(message || "Failed to download");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (checkingAccess || isLoading) {
    return (
      <Button disabled size="lg" className="w-full h-14">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking access...
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {/* 1. HAS ACCESS (Free Guest, Premium User, Free User on Free Stock, or Already Purchased) */}
      {hasAccess && (
        <>
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
            {access?.reason === "PURCHASED"
              ? "Download Again"
              : isFreeGuest
                ? "Download Free"
                : "Download Now"}
          </Button>

          {access?.remainingLimit && (
            <p className="text-xs text-center text-muted-foreground font-medium">
              {isFreeGuest
                ? "3 downloads left today"
                : user?.isAnonymous
                  ? `${access?.remainingLimit ?? 0} downloads left today`
                  : user?.isPremium
                    ? `${user.premiumQuota} Premium downloads left`
                    : `${access?.remainingLimit ?? 0} downloads left today`}
            </p>
          )}
        </>
      )}

      {/* 2. NO ACCESS (Paywalls) */}
      {!hasAccess && (
        <>
          {/* Paywall A: Subscription Allowed */}
          {stock.isPremium && stock.isSubscriptionAccessible && (
            <>
              <Button
                className="w-full h-14 text-lg font-semibold gap-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 border-0"
                onClick={() => router.push("/pricing")}
              >
                <Crown className="h-5 w-5 fill-white/20" /> Get Premium Access
              </Button>

              {user && (
                <>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-medium">
                        Or buy separately
                      </span>
                    </div>
                  </div>

                  <div className={cn("grid", user && "grid-cols-2 gap-2")}>
                    <CreditPayDialog stock={stock} user={user}>
                      <Button
                        variant="outline"
                        className="w-full h-11 text-base font-bold bg-primary hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 gap-2 border-0"
                      >
                        Credit ({Math.ceil(Number(stock?.price) / 1000)})
                      </Button>
                    </CreditPayDialog>

                    <DirectBuyDialog stock={stock} user={user}>
                      <Button className="w-full h-11 text-base font-bold bg-primary hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 gap-2 border-0">
                        <CreditCard className="h-5 w-5" /> Buy for Rp{" "}
                        {(Number(stock?.price) / 1000).toFixed(0) + "K"}
                      </Button>
                    </DirectBuyDialog>
                  </div>
                </>
              )}
            </>
          )}

          {/* Paywall B: Exclusive Paywall (Direct Buy Only) */}
          {stock.isPremium && !stock.isSubscriptionAccessible && (
            <>
              <Button className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 gap-2 border-0">
                <CreditCard className="h-5 w-5" /> Buy for $15.00
              </Button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-dashed" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground font-semibold tracking-wider">
                    Or
                  </span>
                </div>
              </div>

              <Button className="w-full h-14 text-lg font-bold bg-[#cdff00] hover:bg-[#bee400] text-gray-700 shadow-md shadow-[#cdff00]/20 gap-2 border-0">
                <Layers className="h-5 w-5" /> Buy with 10 Credits
              </Button>
            </>
          )}

          {/* Paywall C: Free Stock Limit Reached */}
          {!stock.isPremium && (
            <div className="text-center p-4 border rounded-xl bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50">
              <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">
                Download Limit Reached
              </h4>
              <p className="text-xs text-red-500/80 dark:text-red-400/80 mb-3 font-medium cursor-default">
                {user?.isAnonymous
                  ? "You have used your 3 free anonymous downloads today."
                  : "You have used your 10 free daily downloads today."}
              </p>
              <Button
                className="w-full text-white bg-red-600 hover:bg-red-700 h-11 border-0"
                onClick={() =>
                  router.push(user?.isAnonymous ? "/auth/sign-up" : "/pricing")
                }
              >
                {user?.isAnonymous
                  ? "Sign Up to Continue"
                  : "Upgrade to Premium"}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Give Coffee for Free Stock */}
      {!stock.isPremium && (
        <div className="pt-2">
          <GiveCoffeeDialog
            user={user}
            stockId={stock.id}
            authorName={stock.user.name}
            targetUserId={stock.userId}
          >
            <Button
              variant="outline"
              className="w-full h-10 gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
            >
              <Coffee className="h-4 w-4" /> Buy creator a coffee
            </Button>
          </GiveCoffeeDialog>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
