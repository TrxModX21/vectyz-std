import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Script from "next/script";
import {
  BadgeCheck,
  Check,
  CreditCard,
  Loader2,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useBuyAssetDirect } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { launchConfettiFrame } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { formatPrice } from "@/lib/helpers";
import { useCurrency } from "@/store/use-currency";

declare global {
  interface Window {
    snap: any;
  }
}

const DirectBuyDialog = ({
  stock,
  children,
  user,
}: {
  user?: User;
  stock?: Stock;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWaitingPayment, setIsWaitingPayment] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<
    "midtrans" | "card" | null
  >(null);

  const { currency } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      // Clear success state with a slight delay when dialog closes
      // so it doesn't flicker before the animation ends
      const timeout = setTimeout(() => {
        setIsSuccess(false);
        setIsWaitingPayment(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const { mutateAsync: purchaseAsset } = useBuyAssetDirect();

  const previewFile = stock?.files.find((f) => f.purpose === "PREVIEW");

  const handleAutoDownload = async () => {
    try {
      toast.info("Preparing your download...");
      const response = await api.post(
        `/downloads/${stock?.id}`,
        {},
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stock?.slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.success("Download started!");
    } catch (error: any) {
      toast.error(
        "Asset unlocked, but failed to start download automatically.",
      );
    }
  };

  const onSubmit = async (method: "midtrans" | "card") => {
    try {
      setLoadingMethod(method);

      if (!user) {
        router.push("/auth/sign-in");
      }

      if (method === "midtrans") {
        const response = await purchaseAsset(stock?.id || "");

        if (response?.data?.snapToken && window.snap) {
          setIsOpen(false); // Tutup dialog agar midtrans memiliki layar penuhh
          setIsWaitingPayment(false);

          window.snap.pay(response.data.snapToken, {
            onSuccess: function (result: any) {
              // Berikan jeda waktu agar DOM Click iframe Midtrans tuntas
              // sehingga Dialog Radix tidak trigger onInteractOutside (ghost click)
              setTimeout(() => {
                setIsOpen(true);
                setIsSuccess(true);
                const duration = 1.5 * 1000;
                const end = Date.now() + duration;

                launchConfettiFrame(end);
                handleAutoDownload();
              }, 500);
            },
            onPending: function (result: any) {
              toast.info("One more step! Please complete your payment.");
            },
            onError: function (result: any) {
              toast.error("Payment failed. Please try another method.");
              setIsWaitingPayment(false);
            },
            onClose: function () {
              toast.error("Payment cancelled or not completed.");
              setIsWaitingPayment(false);
            },
          });
        } else {
          toast.error("Failed to load payment gateway.");
          setLoadingMethod(null);
        }
      } else {
        toast.info("Credit payment wiring pending...");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] px-8 py-10 overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-2xl">
        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />

        <DialogHeader className="sr-only">
          <DialogTitle className="text-2xl text-center font-bold">
            Unlock {stock?.title} Access
          </DialogTitle>
          <DialogDescription className="text-center text-sm mt-1.5">
            Chose your payment method
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-amber-100/50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-amber-50 dark:ring-amber-900/10">
              <BadgeCheck
                size={48}
                className="text-green-600 dark:text-green-500"
              />
            </div>
            <h2 className="text-2xl text-center font-bold mb-2">
              Asset Unlocked Successfully! 🎉
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Thank you for your purchase. You now have full access to this
              asset and it's ready to use.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Pane - Info */}
            <div className="p-6 md:p-8 flex flex-col h-full z-10">
              {isWaitingPayment ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 my-auto animate-in fade-in zoom-in duration-300">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <h3 className="text-xl font-bold">Waiting for Payment</h3>
                  <p className="text-sm text-slate-500 text-center px-4">
                    Please complete your payment in the secure popup. Do not
                    close this window.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      Unlock this asset
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      This is a Premium asset. Purchase it directly to instantly
                      unlock "{stock?.title}"
                    </p>

                    <div className="flex items-end mb-6">
                      <span className="text-4xl font-extrabold tracking-tighter">
                        {formatPrice(Number(stock?.price), currency, true)}
                      </span>
                      <span className="text-xs text-slate-600 ml-2 font-medium bg-slate-100 px-2 py-0.5 rounded-md mb-1.5 border border-slate-200">
                        One-time payment
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="h-5 w-5 text-blue-600 shrink-0" />
                        <span>Full resolution & source files</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                        <span>Standard commercial license included</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                        <span>
                          No attribution required for personal or commercial use
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      Select Payment Method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => onSubmit("midtrans")}
                        disabled={loadingMethod !== null}
                        variant="outline"
                        className="h-14 flex items-center justify-start px-4 gap-3 border-[#0079C1]/30 hover:border-[#0079C1] hover:bg-[#0079C1]/5 text-[#0079C1] rounded-xl shadow-sm hover:shadow-md transition-all group"
                      >
                        {loadingMethod === "midtrans" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Smartphone className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="font-semibold text-sm">Midtrans</span>
                      </Button>

                      <Button
                        //   onClick={() => handleSimulatePayment("Card")}
                        //   disabled={paymentState === "pending"}
                        variant="outline"
                        className="h-14 flex items-center justify-start px-4 gap-3 border-[#0079C1]/30 hover:border-[#0079C1] hover:bg-[#0079C1]/5 text-[#0079C1] rounded-xl shadow-sm hover:shadow-md transition-all group"
                      >
                        {/* {paymentState === "pending" ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
                  )} */}
                        <CreditCard className="w-5 h-5" />
                        <span className="font-semibold text-sm">Card</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-14 relative col-span-2 flex items-center justify-center gap-3 border-[#0079C1]/30 hover:border-[#0079C1] hover:bg-[#0079C1]/5 text-[#0079C1] dark:text-[#00A9E0] rounded-xl shadow-sm hover:shadow-md transition-all group"
                        disabled
                      >
                        <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm leading-none">
                          Pay with PayPal
                        </span>
                        <span className="absolute top-1 right-2 text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold uppercase">
                          Soon
                        </span>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Pane - Preview */}
            <div className="hidden md:block relative bg-muted w-full h-[550px]">
              <Image
                src={previewFile?.url || "/placeholder.jpg"}
                alt={stock?.title || "Stock title"}
                fill
                className="object-cover rounded-2xl"
                unoptimized
              />
              {/* Gradient Overlay for blending */}
              <div className="absolute inset-0 bg-linear-to-r from-white via-white/10 to-transparent pointer-events-none" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DirectBuyDialog;
