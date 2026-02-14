import { cn } from "@/lib/utils";

interface HeroTextPricingProps {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

const HeroTextPricing = ({
  billingCycle,
  setBillingCycle,
}: HeroTextPricingProps) => {
  return (
    <div className="text-center space-y-4 mb-24">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
        Fuel Your Creativity with Premium Assets
      </h1>
      <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
        Access the world&apos;s best collection of high-quality vectors, illustrations, and design resources. Choose the perfect plan to streamline your workflow and bring your ideas to life.
      </p>

      <div className="flex justify-center mt-8">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex items-center">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
              billingCycle === "monthly"
                ? "bg-primary text-white shadow-sm dark:bg-white dark:text-black"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
              billingCycle === "yearly"
                ? "bg-primary text-white shadow-sm dark:bg-white dark:text-black"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
            )}
          >
            Yearly
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroTextPricing;
