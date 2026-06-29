import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import { toast } from "sonner";
import { Loader2, Coffee, CreditCard, Layers, Smartphone } from "lucide-react";
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
import {
  useCreateDonationGateway,
  useCreateDonationCredit,
} from "@/hooks/use-transactions";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Field, FieldError } from "../ui/field";
import { launchConfettiFrame } from "@/lib/utils";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { useCurrency } from "@/store/use-currency";

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
  const [loadingMethod, setLoadingMethod] = useState<
    "gateway" | "credit" | null
  >(null);

  const { currency } = useCurrency();

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

  useEffect(() => {
    setValue("amount", currency === "IDR" ? 15000 : 3, {
      shouldValidate: true,
    });
  }, [currency, setValue]);

  const handleAnonymousAccount = async () => {
    try {
      await authClient.signIn.anonymous();
      return true;
    } catch (err) {
      toast.error("Failed to initialize session. Please try again.");
      setLoadingMethod(null);
      return false;
    }
  };

  const validateAmount = (data: DonationFormInputs) => {
    if (currency === "IDR" && data.amount < 11000) {
      toast.error("Minimum donation is Rp 11.000");
      return false;
    }
    if (currency === "USD" && data.amount < 1) {
      toast.error("Minimum donation is $1.00 USD");
      return false;
    }
    return true;
  };

  const handleMidtransGateway = (response: any) => {
    window.snap.pay(response.data.snapToken, {
      onSuccess: function (result: any) {
        // Munculkan kembali dialog untuk menampilkan UI Success
        setIsOpen(true);
        setIsSuccess(true);
        const duration = 1.5 * 1000;
        const end = Date.now() + duration;

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
  };

  const handlePolarGateway = (response: any) => {
    PolarEmbedCheckout.create(response.data.checkoutUrl, {
      theme: "light",
    }).then((checkout) => {
      checkout.addEventListener("success", () => {
        setIsOpen(true);
        setIsSuccess(true);
        setLoadingMethod(null);
        const duration = 1.5 * 1000;
        const end = Date.now() + duration;
        launchConfettiFrame(end);
      });
    });
  };

  const handleCreditGateway = async (data: DonationFormInputs) => {
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
  };

  const onSubmit = async (
    data: DonationFormInputs,
    method: "gateway" | "credit",
  ) => {
    try {
      setLoadingMethod(method);

      if (!user) {
        const success = await handleAnonymousAccount();
        if (!success) return;
      }

      if (!validateAmount(data)) {
        setLoadingMethod(null);
        return;
      }

      if (method === "gateway") {
        const response = await createDonation({
          targetUserId,
          stockId,
          amount: data.amount,
          currency: currency,
        });

        if (currency === "IDR" && response?.data?.snapToken && window.snap) {
          // Tutup dialog utama agar tidak menimpa / memblock Midtrans iframe
          setIsOpen(false);
          handleMidtransGateway(response);
        } else if (currency === "USD" && response?.data?.checkoutUrl) {
          setIsOpen(false);
          handlePolarGateway(response);
        } else {
          toast.error("Failed to load payment gateway.");
          setLoadingMethod(null);
        }
      } else if (method === "credit") {
        handleCreditGateway(data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong.");
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
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
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
                {/* <div className="flex justify-center mb-4">
                  <div className="bg-muted p-1 rounded-full flex gap-1 items-center">
                    <button
                      type="button"
                      onClick={() => setCurrency("IDR")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currency === "IDR" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      IDR (Rp)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currency === "USD" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div> */}

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={
                        amountValue === (currency === "IDR" ? 15000 : 1)
                          ? "default"
                          : "outline"
                      }
                      className={
                        amountValue === (currency === "IDR" ? 15000 : 1)
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                          : "text-muted-foreground font-bold active:scale-95 transition-all"
                      }
                      onClick={() =>
                        setValue("amount", currency === "IDR" ? 15000 : 1, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <Coffee className="w-4 h-4 mr-1.5 opacity-80" />{" "}
                      {currency === "IDR" ? "15k" : "$1"}
                    </Button>
                    <Button
                      type="button"
                      variant={
                        amountValue === (currency === "IDR" ? 30000 : 3)
                          ? "default"
                          : "outline"
                      }
                      className={
                        amountValue === (currency === "IDR" ? 30000 : 3)
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                          : "text-muted-foreground font-bold active:scale-95 transition-all"
                      }
                      onClick={() =>
                        setValue("amount", currency === "IDR" ? 30000 : 3, {
                          shouldValidate: true,
                        })
                      }
                    >
                      {currency === "IDR" ? "Rp 30k" : "$3"}
                    </Button>
                    <Button
                      type="button"
                      variant={
                        amountValue === (currency === "IDR" ? 50000 : 5)
                          ? "default"
                          : "outline"
                      }
                      className={
                        amountValue === (currency === "IDR" ? 50000 : 5)
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm"
                          : "text-muted-foreground font-bold active:scale-95 transition-all"
                      }
                      onClick={() =>
                        setValue("amount", currency === "IDR" ? 50000 : 5, {
                          shouldValidate: true,
                        })
                      }
                    >
                      {currency === "IDR" ? "Rp 50k" : "$5"}
                    </Button>
                  </div>

                  <Field>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-600">
                        {currency === "IDR" ? "Rp" : "$"}
                      </span>
                      <Input
                        type="number"
                        placeholder={
                          currency === "IDR"
                            ? "Manual input (min. 11000)"
                            : "Manual input (min. 1)"
                        }
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

                <div className="grid grid-cols-1 gap-3 mt-4">
                  <Button
                    type="button"
                    disabled={loadingMethod !== null}
                    onClick={handleSubmit((d: any) => onSubmit(d, "gateway"))}
                    variant="outline"
                    className="h-16 flex-col items-center justify-center gap-1.5 border-lime-300 hover:border-lime-500 hover:bg-lime-50/50 dark:border-lime-900/30 dark:hover:bg-lime-900/20 text-lime-700 dark:text-lime-500 rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                  >
                    {loadingMethod === "gateway" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {currency === "IDR" ? (
                          <Smartphone className="w-5 h-5" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                        <span className="font-semibold text-xs text-center leading-none">
                          {currency === "IDR"
                            ? "Midtrans Gateway"
                            : "Polar Gateway"}
                        </span>
                      </>
                    )}
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
                {currency === "USD" ? (
                  <p className="text-[11px] font-bold text-foreground text-center mt-3 leading-tight">
                    * Note: Polar may apply additional VAT/Sales Tax depending
                    on your region.
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-foreground text-center mt-3 leading-tight">
                    * Note: Midtrans currently only supports payments within
                    Indonesia.
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiveCoffeeDialog;
