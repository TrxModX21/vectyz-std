
import { Check, CreditCard, Globe, Lock, ShieldCheck, Loader } from "lucide-react";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { formatRupiah } from "@/lib/helpers";

interface OrderSummaryProps {
  plan: Plan; // Or any specific type
  isAnnual: boolean;
  setIsAnnual: (val: boolean) => void;
  planName: string;
  currentPrice: number;
  finalPrice: number;
  durationLabel: string;
  formattedExpireDate: string;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  isSubmitting?: boolean;
}

const OrderSummary = ({
  plan,
  isAnnual,
  setIsAnnual,
  planName,
  currentPrice,
  finalPrice,
  durationLabel,
  formattedExpireDate,
  paymentMethod,
  setPaymentMethod,
  isSubmitting,
}: OrderSummaryProps) => {
  return (
    <div className="w-full md:w-[520px] bg-muted/40 p-8 border-l flex flex-col">
      <h3 className="font-semibold text-foreground mb-6 text-lg">Plan info</h3>

      <div className="bg-background rounded-lg p-4 border mb-6 shadow-sm">
        <h4 className="font-bold mb-2 text-sm">With {planName} you get</h4>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {plan?.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 flex-1">
        {plan?.isSupportYearly && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Billing Cycle</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${!isAnnual ? "font-bold text-foreground" : "text-muted-foreground"}`}
              >
                Monthly
              </span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} disabled={isSubmitting} />
              <span
                className={`text-xs ${isAnnual ? "font-bold text-foreground" : "text-muted-foreground"}`}
              >
                Annual
              </span>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Subtotal ({durationLabel})
            </span>

            <span>{formatRupiah(currentPrice)}</span>
          </div>
          {isAnnual && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Annual savings applied</span>
              <span>-17%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (0%)</span>
            <span>{formatRupiah(0)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-end">
          <div>
            <span className="block text-sm font-medium">
              Total charged today
            </span>
            <span className="text-xs text-muted-foreground">
              Expired on {formattedExpireDate}
            </span>
          </div>
          <span className="text-2xl font-bold">
            {formatRupiah(finalPrice)}
          </span>
        </div>

        <Separator />

        {/* Payment method */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Payment method</h3>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid grid-cols-3 gap-4"
            disabled={isSubmitting}
          >
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-24"
              >
                <CreditCard className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Card</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="paypal"
                id="paypal"
                className="peer sr-only"
              />
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-24"
              >
                <Globe className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Paypal</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="midtrans"
                id="midtrans"
                className="peer sr-only"
              />
              <Label
                htmlFor="midtrans"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all h-24"
              >
                <ShieldCheck className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Midtrans</span>
              </Label>
            </div>
          </RadioGroup>

          {/* Secure Payment Note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
            <Lock className="h-3 w-3" />
            <span>Secure payment with SSL Encryption</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button className="w-full h-12 text-lg" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm and pay"
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-3 leading-tight">
          By clicking "Confirm and pay" you agree to our Terms of Use. Automatic
          renewal every {isAnnual ? "year" : "month"}. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
