import {
  BadgeCheck,
  CreditCard,
  Crown,
  Loader2,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useTopupCredit } from "../../hooks/use-transactions";
import { toast } from "sonner";
import Script from "next/script";
import { cn, launchConfettiFrame } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/helpers";
import { useCurrency } from "@/store/use-currency";

declare global {
  interface Window {
    snap: any;
  }
}

const creditPackages = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 50000,
    icon: Zap,
    popular: false,
    description: "Perfect for occasional needs",
  },
  {
    id: "pro",
    name: "Pro",
    credits: 120,
    price: 120000,
    icon: Sparkles,
    popular: true,
    description: "Best value for creators",
  },
  {
    id: "ultra",
    name: "Ultra",
    credits: 500,
    price: 500000,
    icon: Crown,
    popular: false,
    description: "For heavy power users",
  },
];

const TopUpDialog = ({ children }: { children: ReactNode }) => {
  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1].id);
  const [customCredits, setCustomCredits] = useState("100");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { currency } = useCurrency();

  const queryClient = useQueryClient();

  const { mutate: topupCredit, isPending } = useTopupCredit();

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const isCustom = selectedPackage === "custom";

  const getSelectedDetails = () => {
    if (isCustom) {
      const credits = parseInt(customCredits) || 0;
      return { credits };
    }
    const pkg = creditPackages.find((p) => p.id === selectedPackage);
    return pkg ? { credits: pkg.credits } : { credits: 0 };
  };

  const { credits: selectedCredits } = getSelectedDetails();
  const isValidCustomAmount = isCustom ? selectedCredits >= 10 : true;

  const handleCustomCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomCredits(value);
  };

  const handleMidtransPayment = () => {
    if (!isValidCustomAmount) {
      toast.error("Minimum custom top up is 10 Credits");
      return;
    }

    topupCredit(selectedCredits, {
      onSuccess: (data) => {
        // data contains the result from backend
        // Assume data contains { snapToken } based on API response structure
        const snapToken = data.data?.snapToken || data.snapToken;

        if (!snapToken) {
          toast.error("Failed to get payment token from server.");
          return;
        }

        setIsOpen(false);

        // Midtrans Snap Popup
        window.snap.pay(snapToken, {
          onSuccess: function (result: any) {
            setTimeout(() => {
              setIsOpen(true);
              setIsSuccess(true);
              const duration = 1.5 * 1000;
              const end = Date.now() + duration;

              launchConfettiFrame(end);
              queryClient.invalidateQueries({ queryKey: ["authUser"] });
            }, 500);
          },
          onPending: function (result: any) {
            toast.info("Waiting for your payment.");
          },
          onError: function (result: any) {
            toast.error("Payment failed. Please try again.");
          },
          onClose: function () {
            toast.error("Payment cancelled or not completed.");
          },
        });
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || "Failed to create transaction",
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild onClick={() => setIsOpen(true)}>
            {children}
          </TooltipTrigger>
          <TooltipContent>
            <p>Credit Balance</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">
        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
              ? "https://app.midtrans.com/snap/snap.js"
              : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />

        <div className={cn("bg-muted/30 p-6 border-b", isSuccess && "sr-only")}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Top Up Credits</DialogTitle>
            <DialogDescription>
              Purchase credits to download premium assets. Credits never expire.
            </DialogDescription>
          </DialogHeader>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 px-8 py-10">
            <div className="w-24 h-24 bg-amber-100/50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-amber-50 dark:ring-amber-900/10">
              <BadgeCheck
                size={48}
                className="text-green-600 dark:text-green-500"
              />
            </div>
            <h2 className="text-2xl text-center font-bold mb-2">
              Credits Added Successfully! 🎉
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Your balance has been topped up. Enjoy browsing and unlocking the
              assets you love.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="p-6 grid gap-6 overflow-y-auto">
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Select Package
              </Label>
              <RadioGroup
                defaultValue={selectedPackage}
                onValueChange={setSelectedPackage}
                className="grid grid-cols-1 gap-4"
              >
                {creditPackages.map((pkg) => (
                  <div key={pkg.id}>
                    <RadioGroupItem
                      value={pkg.id}
                      id={pkg.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={pkg.id}
                      className="flex items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            pkg.popular
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <pkg.icon className="h-5 w-5" />
                        </div>
                        <div className="grid gap-1">
                          <span className="font-semibold text-lg flex items-center gap-2">
                            {pkg.credits} Credits
                            {pkg.popular && (
                              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Popular
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground font-normal">
                            {pkg.description}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-xl">
                          {formatPrice(pkg.credits, currency, true)}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}

                {/* Custom Option */}
                <div>
                  <RadioGroupItem
                    value="custom"
                    id="custom"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="custom"
                    className="flex flex-col rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div className="grid gap-1">
                          <span className="font-semibold text-lg">
                            Custom Amount
                          </span>
                          <span className="text-sm text-muted-foreground font-normal">
                            Enter amount ({formatPrice(1, currency)}/credit)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`grid gap-2 transition-all ${isCustom ? "opacity-100 max-h-20" : "opacity-40 max-h-0 overflow-hidden"}`}
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Enter credits..."
                          value={customCredits}
                          onChange={handleCustomCreditChange}
                          className="h-10 font-bold text-lg"
                          disabled={!isCustom}
                        />
                        <span className="font-semibold whitespace-nowrap">
                          ={" "}
                          {formatPrice(
                            parseInt(customCredits || "0"),
                            currency,
                          )}
                        </span>
                      </div>
                      {isCustom && parseInt(customCredits || "0") < 10 && (
                        <span className="text-xs text-destructive">
                          Minimum custom amount is 10 Credits.
                        </span>
                      )}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium text-muted-foreground">
                  Total to pay
                </span>
                <span className="text-3xl font-bold">
                  {/* {formatRupiah(price)} */}
                  {formatPrice(selectedCredits, currency, true)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleMidtransPayment}
                  disabled={isPending || !isValidCustomAmount}
                  className="h-14 flex items-center justify-start px-4 gap-3 border-[#0079C1]/30 hover:border-[#0079C1] hover:bg-[#0079C1]/5 text-[#0079C1] rounded-xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-500" />
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-sm">Midtrans</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  disabled
                  title="Coming Soon"
                  className="h-14 flex items-center justify-start px-4 gap-3 border-slate-200 text-slate-400 rounded-xl bg-slate-50 opacity-80 cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold text-sm flex-1 text-left">
                    Card
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                    Soon
                  </span>
                </Button>

                <Button
                  variant="outline"
                  disabled
                  title="Coming Soon"
                  className="h-14 col-span-2 flex items-center justify-center gap-3 border-slate-200 text-slate-400 rounded-xl bg-slate-50 opacity-80 cursor-not-allowed relative"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-semibold text-sm leading-none">
                    Pay with PayPal
                  </span>
                  <span className="absolute right-4 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                    Soon
                  </span>
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-center text-xs text-muted-foreground">
                  Purchased credits are added to your shopping balance. They
                  cannot be withdrawn and are exclusively for platform usage.
                </p>
                <p className="text-center text-xs text-muted-foreground/60">
                  Secured by Midtrans. By continuing, you agree to our Terms of
                  Service.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;
