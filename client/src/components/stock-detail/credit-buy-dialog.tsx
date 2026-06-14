import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { api } from "@/lib/axios";
import { BadgeCheck, Check, Layers, Zap, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useBuyAssetCredit } from "@/hooks/use-transactions";
import TopUpDialog from "../common/top-up-dialog";
import { launchConfettiFrame } from "@/lib/utils";

const CreditPayDialog = ({
  stock,
  user,
  children,
}: {
  user?: User;
  stock?: Stock;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: buyWithCredit, isPending } = useBuyAssetCredit();

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const previewFile = stock?.files.find((f) => f.purpose === "PREVIEW");
  const priceInCredit = Number(stock?.price) || 0;
  const isUserHaveCredit = Number(user?.creditBalance) >= priceInCredit;

  const handlePay = () => {
    if (!stock?.id) return;
    buyWithCredit(stock.id, {
      onSuccess: () => {
        setIsSuccess(true);
        const duration = 1.5 * 1000;
        const end = Date.now() + duration;
        launchConfettiFrame(end);

        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        queryClient.invalidateQueries({ queryKey: ["stock"] });
        queryClient.invalidateQueries({ queryKey: ["checkAccess", stock.id] });

        handleAutoDownload();
      },
    });
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] px-8 py-10 overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle className="text-2xl text-center font-bold">
            Unlock {stock?.title} Access
          </DialogTitle>
          <DialogDescription className="text-center text-sm mt-1.5">
            Process your payment with credit
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <>
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
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Pane - Info */}
              <div className="p-6 md:p-8 flex flex-col h-full z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-2 tracking-tight">
                    Unlock with Credits
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Use your available app credits to instantly unlock "
                    {stock?.title}".
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold tracking-tighter">
                      {priceInCredit}
                    </span>
                    <span className="text-base text-slate-500 ml-2 font-medium">
                      Credits
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
                  {isUserHaveCredit ? (
                    <Button
                      onClick={handlePay}
                      disabled={isPending}
                      className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 border-0 group transition-all rounded-xl"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Layers className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      )}
                      Buy with {priceInCredit} Credits
                    </Button>
                  ) : (
                    <TopUpDialog>
                      <Button className="w-full h-14 text-base font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10 border-0 group transition-all rounded-xl">
                        <Zap className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Top Up to Buy (Need {priceInCredit} Credits)
                      </Button>
                    </TopUpDialog>
                  )}
                  <p className="text-xs text-center text-slate-500 mt-3">
                    Your current balance:{" "}
                    <span
                      className={
                        isUserHaveCredit
                          ? "font-semibold text-slate-900"
                          : "font-semibold text-rose-500"
                      }
                    >
                      {Number(user?.creditBalance || 0)} Credits
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Pane - Preview */}
              <div className="hidden md:block relative bg-muted w-full h-[500px]">
                <Image
                  src={previewFile?.url || "/placeholder.jpg"}
                  alt={stock?.title || ""}
                  fill
                  className="object-cover rounded-2xl"
                  unoptimized
                />
                {/* Gradient Overlay for blending */}
                <div className="absolute inset-0 bg-linear-to-r from-white via-white/30 to-transparent pointer-events-none" />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreditPayDialog;
