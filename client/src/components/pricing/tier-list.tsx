import { Skeleton } from "@/components/ui/skeleton";
import { Check, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FadeIn from "../common/fade-in";
import { useGetAllPlans } from "@/hooks/use-plan";
import SubscriptionDialog from "./subscription-dialog";

interface TierListProps {
  billingCycle: "monthly" | "yearly";
}

const TierList = ({ billingCycle }: TierListProps) => {
  const { data, isLoading } = useGetAllPlans();

  if (isLoading) {
    return <TierSkeleton />;
  }

  const plans = data?.plans || [];
  const firstTire = plans[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      <FadeIn direction="right" delay={1.2}>
        <div
          className={cn(
            "relative flex flex-col p-6 bg-white rounded-2xl border transition-all duration-300",
            firstTire.isBestValue
              ? "border-primary shadow-xl scale-105 z-10" // Featured style
              : "border-v-green dark:border-zinc-800 hover:border-zinc-300 shadow-sm hover:shadow-md",
          )}
        >
          {firstTire.isBestValue && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Best Valueable
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {firstTire.name}
            </h3>
            <div className="mt-4 flex items-baseline text-zinc-900 dark:text-zinc-50">
              <span className="text-4xl font-bold tracking-tight">
                Rp {(firstTire.price / 1000).toFixed(0) + "K"}
              </span>
              <span className="ml-1 text-sm font-semibold text-zinc-500">
                /48Hours
              </span>
            </div>
          </div>

          <SubscriptionDialog planId={firstTire.id}>
            <Button
              className={cn(
                "w-full mb-8 font-semibold h-11",
                firstTire.isBestValue
                  ? "bg-primary hover:bg-blue-600 text-white"
                  : "bg-v-green hover:bg-green-600 text-white",
              )}
            >
              Get {firstTire.name.split(" ")[0]}
            </Button>
          </SubscriptionDialog>

          <div className="space-y-6 flex-1">
            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
              {firstTire.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mt-0.5 mr-3">
                    <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>

      {plans.slice(1).map((tier, index) => {
        const delay = [1.25, 1.3, 1.35];
        return (
          <FadeIn key={tier.id} direction="right" delay={delay[index]}>
            <div
              className={cn(
                "relative flex flex-col p-6 bg-white rounded-2xl border transition-all duration-300",
                tier.isBestValue
                  ? "border-primary shadow-xl scale-105 z-10" // Featured style
                  : "border-v-green dark:border-zinc-800 hover:border-zinc-300 shadow-sm hover:shadow-md",
              )}
            >
              {tier.isBestValue && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Best Valueable
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline text-zinc-900 dark:text-zinc-50">
                  <span className="text-4xl font-bold tracking-tight">
                    Rp {(tier.price / 1000).toFixed(0) + "K"}
                    {/* {billingCycle === "monthly"
                    ? (tier.price / 1000).toFixed(0) + "K"
                    : (Math.round((tier.priceInYear || 0) / 12) / 1000).toFixed(
                        0,
                      ) + "K"} */}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-zinc-500">
                    /month
                  </span>
                </div>
                {/* {billingCycle === "yearly" && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  Billed yearly (Rp{" "}
                  {((tier.priceInYear || 0) / 1000).toFixed(0)}K)
                </p>
              )} */}
              </div>

              <SubscriptionDialog planId={tier.id}>
                <Button
                  className={cn(
                    "w-full mb-8 font-semibold h-11",
                    tier.isBestValue
                      ? "bg-primary hover:bg-blue-600 text-white"
                      : "bg-v-green hover:bg-green-600 text-white",
                  )}
                >
                  Get {tier.name.split(" ")[0]}
                </Button>
              </SubscriptionDialog>

              <div className="space-y-6 flex-1">
                <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mt-0.5 mr-3">
                        <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 space-y-3">
                  <div className="relative py-4">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-zinc-400" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-zinc-400">
                        <Plus className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {plans.slice(0, index + 1).map((prevTier) => (
                    <p
                      key={prevTier.id}
                      className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mr-3 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                      Everything in {prevTier.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
};

export default TierList;

const TierSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative flex flex-col p-6 bg-white rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          {/* Title Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-6 w-24 rounded" />
            <div className="mt-4 flex items-baseline">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="ml-2 h-4 w-12 rounded" />
            </div>
            {/* Optional yearly text skeleton */}
            <Skeleton className="h-4 w-28 rounded mt-2" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="w-full h-11 rounded mb-8" />

          {/* Features Skeleton */}
          <div className="space-y-6 flex-1">
            <ul className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <li key={j} className="flex items-start">
                  <Skeleton className="shrink-0 w-5 h-5 rounded-full mr-3" />
                  <Skeleton className="h-4 w-full rounded" />
                </li>
              ))}
            </ul>

            {/* Everything In Skeleton */}
            {i > 1 && (
              <div className="pt-4 space-y-3">
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <Skeleton className="w-8 h-4 rounded" />
                  </div>
                </div>
                {[...Array(i - 1)].map((_, k) => (
                  <div key={k} className="flex items-center">
                    <Skeleton className="shrink-0 w-5 h-5 rounded-full mr-3" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
