import { Check, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TierListProps {
  billingCycle: "monthly" | "yearly";
}

const tiers = [
  {
    name: "Hobby",
    price: { monthly: 99, yearly: 990 }, // ~20% off yearly
    description: "For individuals starting out",
    features: [
      "Access to basic analytics reports",
      "Up to 10,000 data points per month",
      "Email support",
      "Community forum access",
      "Cancel anytime",
    ],
    highlighted: false,
    cta: "Get Hobby",
  },
  {
    name: "Starter",
    price: { monthly: 299, yearly: 2990 },
    description: "For growing teams and startups",
    features: [
      "Advanced analytics dashboard",
      "Customizable reports and charts",
      "Real-time data tracking",
      "Integration with third-party tools",
    ],
    everythingIn: "Hobby",
    highlighted: true,
    badge: "Most Popular",
    cta: "Get Starter",
  },
  {
    name: "Pro",
    price: { monthly: 1490, yearly: 14900 },
    description: "For large scale organizations",
    features: [
      "Unlimited data storage",
      "Customizable dashboards",
      "Advanced data segmentation",
      "Real-time data processing",
      "AI-powered insights",
    ],
    everythingIn: "Starter",
    highlighted: false,
    cta: "Get Pro",
  },
  {
    name: "Enterprise",
    price: { monthly: 2990, yearly: 29900 },
    description: "For industry leaders",
    features: [
      "Dedicated success manager",
      "SSO & Advanced Security",
      "Custom SLA",
      "Audit logs",
      "Priority 24/7 support",
    ],
    everythingIn: "Pro",
    highlighted: false,
    cta: "Contact Sales",
  },
];

const TierList = ({ billingCycle }: TierListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={cn(
            "relative flex flex-col p-6 bg-white rounded-2xl border transition-all duration-300",
            tier.highlighted
              ? "border-primary shadow-xl scale-105 z-10" // Featured style
              : "border-v-green dark:border-zinc-800 hover:border-zinc-300 shadow-sm hover:shadow-md",
          )}
        >
          {tier.highlighted && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {tier.badge}
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {tier.name}
            </h3>
            <div className="mt-4 flex items-baseline text-zinc-900 dark:text-zinc-50">
              <span className="text-4xl font-bold tracking-tight">
                $
                {billingCycle === "monthly"
                  ? tier.price.monthly
                  : Math.round(tier.price.yearly / 12)}
              </span>
              <span className="ml-1 text-sm font-semibold text-zinc-500">
                /month
              </span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-xs text-green-600 font-medium mt-1">
                Billed yearly (${tier.price.yearly})
              </p>
            )}
          </div>

          <Button
            className={cn(
              "w-full mb-8 font-semibold h-11",
              tier.highlighted
                ? "bg-primary hover:bg-blue-600 text-white"
                : "bg-v-green hover:bg-green-600 text-white",
            )}
          >
            {tier.cta}
          </Button>

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

            {tier.everythingIn && (
              <div className="pt-4">
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-300 dark:text-zinc-600">
                      <Plus className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mr-3 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                  Everything in {tier.everythingIn} Plan
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierList;
