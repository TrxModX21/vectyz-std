import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import {
  Loader2,
  Coffee,
  CreditCard,
  Layers,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  donationSchema,
  DonationFormInputs,
} from "@/validators/transaction.validation";
import { useCreateDonationGateway, useCreateDonationCredit } from "@/hooks/use-transactions";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Field, FieldError } from "../ui/field";
import { launchConfettiFrame } from "@/lib/utils";

declare global {
  interface Window {
    snap: any;
  }
}

const GiveCoffeeDialog = ({
  user,
  authorName,
  targetUserId,
  stockId,
  children,
}: {
  user?: User;
  authorName: string;
  targetUserId: string;
  stockId: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Clear success state with a slight delay when dialog closes
      // so it doesn't flicker before the animation ends
      const timeout = setTimeout(() => setIsSuccess(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  const queryClient = useQueryClient();
  const { mutateAsync: createDonation } = useCreateDonationGateway();
  const { mutateAsync: createDonationCredit } = useCreateDonationCredit();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormInputs>({
    resolver: zodResolver(donationSchema) as any,
    defaultValues: { amount: 15000 },
  });

  const amountValue = watch("amount");
  const [loadingMethod, setLoadingMethod] = useState<
    "midtrans" | "credit" | null
  >(null);

  const onSubmit = async (
    data: DonationFormInputs,
    method: "midtrans" | "credit",
  ) => {
    try {
      setLoadingMethod(method);

      if (!user) {
        try {
          await authClient.signIn.anonymous();
        } catch (err) {
          toast.error("Failed to initialize session. Please try again.");
          setLoadingMethod(null);
          return;
        }
      }

      if (method === "midtrans") {
        const response = await createDonation({
          targetUserId,
          stockId,
          amount: data.amount,
        });

        if (response?.data?.snapToken && window.snap) {
          // Tutup dialog utama agar tidak menimpa / memblock Midtrans iframe
          setIsOpen(false);

          window.snap.pay(response.data.snapToken, {
            onSuccess: function (result: any) {
              // Munculkan kembali dialog untuk menampilkan UI Success
              setIsOpen(true);
              setIsSuccess(true);
              const duration = 1.5 * 1000;
              const end = Date.now() + duration;

              // const frame = () => {
              //   confetti({
              //     particleCount: 5,
              //     angle: 60,
              //     spread: 55,
              //     origin: { x: 0 },
              //     colors: ["#A3FF12", "#009CDE", "#ffffff", "#f59e0b"],
              //   });
              //   confetti({
              //     particleCount: 5,
              //     angle: 120,
              //     spread: 55,
              //     origin: { x: 1 },
              //     colors: ["#A3FF12", "#009CDE", "#ffffff", "#f59e0b"],
              //   });

              //   if (Date.now() < end) {
              //     requestAnimationFrame(frame);
              //   }
              // };
              // frame();
              launchConfettiFrame(end);
            },
            onPending: function (result: any) {
              toast.info("One more step! Please complete your payment.");
            },
            onError: function (result: any) {
              toast.error("Payment failed. Please try another method.");
            },
            onClose: function () {
              toast.error("Payment cancelled or not completed.");
            },
          });
        } else {
          toast.error("Failed to load payment gateway.");
          setLoadingMethod(null);
        }
      } else if (method === "credit") {
        await createDonationCredit({
          targetUserId,
          stockId,
          amount: data.amount,
        });

        setIsSuccess(true);
        const duration = 1.5 * 1000;
        const end = Date.now() + duration;
        launchConfettiFrame(end);

        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
      setLoadingMethod(null);
    } finally {
      if (method === "credit") {
        setLoadingMethod(null);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border-0 p-0 rounded-2xl">
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />

        <div className="absolute top-0 left-0 w-full h-32 bg-amber-50 dark:bg-amber-900/10 -z-10" />
        <div className="px-6 pt-8 pb-8 bg-background/50 backdrop-blur-sm">
          {isSuccess ? (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle className="text-2xl text-center font-bold">
                  Send Coffee Success
                </DialogTitle>
                <DialogDescription className="text-center text-sm mt-1.5">
                  Thank you!
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-amber-100/50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-amber-50 dark:ring-amber-900/10">
                  <Coffee
                    size={48}
                    className="text-amber-600 dark:text-amber-500"
                  />
                </div>
                <h2 className="text-2xl text-center font-bold mb-2">
                  Thank you for supporting {authorName}!
                </h2>
                <p className="text-center text-muted-foreground text-sm mb-8">
                  Your coffee has been sent successfully. We truly appreciate
                  your support!
                </p>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-12 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-2 shadow-sm ring-4 ring-amber-50 dark:ring-amber-900/20">
                  <Coffee className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                </div>
                <DialogTitle className="text-2xl text-center font-bold">
                  Support {authorName}
                </DialogTitle>
                <DialogDescription className="text-center text-sm mt-1.5">
                  Buy them a coffee to show your appreciation!
                </DialogDescription>
              </DialogHeader>

              <form className="mt-8 space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={amountValue === 15000 ? "default" : "outline"}
                      className={
                        amountValue === 15000
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                          : "text-muted-foreground font-bold active:scale-95 transition-all"
                      }
                      onClick={() =>
                        setValue("amount", 15000, { shouldValidate: true })
                      }
                    >
                      <Coffee className="w-4 h-4 mr-1.5 opacity-80" /> 15k
                    </Button>
                    <Button
                      type="button"
                      variant={amountValue === 30000 ? "default" : "outline"}
                      className={
                        amountValue === 30000
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                          : "text-muted-foreground font-bold active:scale-95 transition-all"
                      }
                      onClick={() =>
                        setValue("amount", 30000, { shouldValidate: true })
                      }
                    >
                      Rp 30k
                    </Button>
                    <Button
                      type="button"
                      variant={amountValue === 50000 ? "default" : "outline"}
                      className={
                        amountValue === 50000
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                          : "text-muted-foreground font-bold active:scale-95 transition-all"
                      }
                      onClick={() =>
                        setValue("amount", 50000, { shouldValidate: true })
                      }
                    >
                      Rp 50k
                    </Button>
                  </div>

                  <Field>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-600">
                        Rp
                      </span>
                      <Input
                        type="number"
                        placeholder="Manual input (min. 11000)"
                        className={`pl-11 h-12 font-medium bg-background shadow-xs transition-colors ${errors.amount ? "border-red-500 focus-visible:ring-red-500" : "border-amber-500 ring-1 ring-amber-500/30"}`}
                        {...register("amount")}
                      />
                    </div>
                    {errors.amount && (
                      <FieldError className="text-xs text-red-500 mt-1.5 font-medium ml-1">
                        {errors.amount.message}
                      </FieldError>
                    )}
                  </Field>
                </div>

                <div className="relative py-2 pt-2">
                  <div className="absolute inset-0 flex items-center pt-2">
                    <span className="w-full border-t border-dashed" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase pt-2">
                    <span className="bg-background px-3 text-muted-foreground font-semibold tracking-wider">
                      Choose Method
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    type="button"
                    disabled={loadingMethod !== null}
                    onClick={handleSubmit((d: any) => onSubmit(d, "midtrans"))}
                    variant="outline"
                    className="h-16 flex-col items-center justify-center gap-1.5 border-lime-300 hover:border-lime-500 hover:bg-lime-50/50 dark:border-lime-900/30 dark:hover:bg-lime-900/20 text-lime-700 dark:text-lime-500 rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    {loadingMethod === "midtrans" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Smartphone className="w-5 h-5" />
                        <span className="font-semibold text-xs">Midtrans</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    disabled={loadingMethod !== null}
                    onClick={handleSubmit((d: any) => onSubmit(d, "midtrans"))}
                    variant="outline"
                    className="h-16 flex-col items-center justify-center gap-1.5 border-lime-300 hover:border-lime-500 hover:bg-lime-50/50 dark:border-lime-900/30 dark:hover:bg-lime-900/20 text-lime-700 dark:text-lime-500 rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-semibold text-xs">Card</span>
                  </Button>
                  <Button
                    type="button"
                    disabled
                    variant="outline"
                    className="h-16 flex-col items-center justify-center gap-1.5 border-gray-200 dark:border-gray-800 text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl relative overflow-hidden opacity-75"
                  >
                    <Wallet className="w-5 h-5" />
                    <span className="font-semibold text-xs text-center leading-none">
                      PayPal
                    </span>
                    <span className="absolute top-1 right-2 text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold uppercase">
                      Soon
                    </span>
                  </Button>
                  <Button
                    type="button"
                    disabled={loadingMethod !== null}
                    onClick={handleSubmit((d: any) => onSubmit(d, "credit"))}
                    variant="outline"
                    className="h-16 flex-col items-center justify-center gap-1.5 border-lime-300 hover:border-lime-500 hover:bg-lime-50/50 dark:border-lime-900/30 dark:hover:bg-lime-900/20 text-lime-700 dark:text-lime-500 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    {loadingMethod === "credit" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Layers className="w-5 h-5" />
                        <span className="font-semibold text-xs text-center leading-none">
                          Credit Balance
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiveCoffeeDialog;
