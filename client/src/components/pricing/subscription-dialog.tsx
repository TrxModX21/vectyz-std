import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useGetPlanDetail } from "@/hooks/use-plan";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import OrderSummary from "./order-summary";
import { Skeleton } from "../ui/skeleton";
import { addDays, format } from "date-fns";
import { useCreateSubscription } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  subscriptionSchema,
  SubscriptionFormInputs,
} from "@/validators/transaction.validation";

interface SubscriptionDialogProps {
  planId: string;
  children?: ReactNode;
}

const SubscriptionDialog = ({ planId, children }: SubscriptionDialogProps) => {
  const { data, isLoading } = useGetPlanDetail(planId);
  const { mutateAsync: createSubscription, isPending: isSubmitting } =
    useCreateSubscription();
  const { data: userProfileResponse } = useAuth(); // Hook to get current user data
  const user = userProfileResponse?.user;

  const [paymentMethod, setPaymentMethod] = useState("midtrans");
  const [isAnnual, setIsAnnual] = useState(false);

  // Form Hook
  const form = useForm<SubscriptionFormInputs>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  // Pre-fill form when user data is loaded
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name || "");
      form.setValue("email", user.email || "");

      if (user.profile) {
        if (user.profile.mobile) form.setValue("phone", user.profile.mobile);
        if (user.profile.address)
          form.setValue("address", user.profile.address);
        if (user.profile.city) form.setValue("city", user.profile.city);
        if (user.profile.zip) form.setValue("postalCode", user.profile.zip);
        if (user.profile.countryName)
          form.setValue("country", user.profile.countryName);
      }
    }
  }, [user, form]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  if (isLoading) {
    return <SubscriptionDialogSkeleton>{children}</SubscriptionDialogSkeleton>;
  }

  const plan = data?.plan;
  const planName = plan?.name.split(" ")[0];

  // Logic Pricing
  const currentPrice = isAnnual ? (plan?.price || 0) * 12 : plan?.price || 0;
  const finalPrice = isAnnual ? plan?.priceInYear || 0 : plan?.price || 0;

  // Logic Date
  const today = new Date();
  const expireDate = addDays(today, plan?.durationDays || 30);
  const formattedExpireDate = format(expireDate, "dd/MM/yyyy");
  const durationLabel =
    plan?.durationDays! < 30
      ? `${plan?.durationDays} Days`
      : isAnnual
        ? "Yearly"
        : "Monthly";

  const onSubmit = async (formData: SubscriptionFormInputs) => {
    try {
      const billingCycle =
        plan?.durationDays! < 30 ? "ONE_TIME" : isAnnual ? "YEARLY" : "MONTHLY";

      const payload = {
        planId,
        billingCycle,
        phone: formData.phone,
        billingAddress: {
          first_name: formData.name.split(" ")[0],
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country_code: formData?.country?.substring(0, 3).toUpperCase(), // Basic normalization
        },
      } as any;

      const result = await createSubscription(payload);

      if (result?.data?.redirectUrl) {
        window.location.href = result.data.redirectUrl;
      } else {
        toast.success(
          "Subscription initiated! Check your email or notifications.",
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create subscription",
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 overflow-y-scroll gap-0 md:h-auto max-h-[90vh] flex flex-col md:block max-w-5xl!">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row h-full"
        >
          {/* Left column */}
          <div className="flex-1 p-8">
            <DialogHeader className="mb-6 text-left">
              <DialogTitle className="text-3xl font-bold text-gray-800">
                Get {planName}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Complete your subscription to unlock premium features.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Billing Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">
                  Billing information
                </h3>

                <div className="grid gap-4">
                  <Field className="grid gap-2">
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                      {...register("name")}
                    />
                    <FieldError>{errors.name?.message}</FieldError>
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@doe.example"
                        disabled={isSubmitting}
                        {...register("email")}
                      />
                      <FieldError>{errors.email?.message}</FieldError>
                    </Field>

                    <Field className="grid gap-2">
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+62 82238490219"
                        disabled={isSubmitting}
                        {...register("phone")}
                      />
                      <FieldError>{errors.phone?.message}</FieldError>
                    </Field>
                  </div>

                  <Field className="grid gap-2">
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Textarea
                      id="address"
                      placeholder="Street address"
                      className="resize-none"
                      maxLength={100}
                      disabled={isSubmitting}
                      {...register("address")}
                    />
                    <FieldError>{errors.address?.message}</FieldError>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field className="grid gap-2">
                      <FieldLabel htmlFor="city">City</FieldLabel>
                      <Input
                        id="city"
                        placeholder="City"
                        disabled={isSubmitting}
                        {...register("city")}
                      />
                      <FieldError>{errors.city?.message}</FieldError>
                    </Field>

                    <Field className="grid gap-2">
                      <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                      <Input
                        id="postalCode"
                        placeholder="12345"
                        disabled={isSubmitting}
                        {...register("postalCode")}
                      />
                      <FieldError>{errors.postalCode?.message}</FieldError>
                    </Field>
                  </div>

                  <Field className="grid gap-2">
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Input
                      id="country"
                      placeholder="Indonesia"
                      disabled={isSubmitting}
                      {...register("country")}
                    />
                    <FieldError>{errors.country?.message}</FieldError>
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <OrderSummary
            plan={plan!}
            isAnnual={isAnnual}
            setIsAnnual={setIsAnnual}
            planName={planName || ""}
            currentPrice={currentPrice}
            finalPrice={finalPrice}
            durationLabel={durationLabel}
            formattedExpireDate={formattedExpireDate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SubscriptionDialogSkeleton = ({ children }: { children: ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 overflow-hidden md:h-auto max-h-[90vh] flex flex-col md:block max-w-5xl!">
        <div className="flex flex-col md:flex-row h-full">
          {/* Skeleton Left: Billing Info */}
          <div className="flex-1 p-8 space-y-6">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="grid gap-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>

          {/* Skeleton Right: Plan Info */}
          <div className="w-full md:w-[520px] bg-muted/40 p-8 border-l flex flex-col space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full mt-4" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
