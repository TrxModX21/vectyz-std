'use client';

import Footer from "@/components/common/footer";
import Header from "@/components/landing/header";
import HeroTextPricing from "@/components/pricing/hero-text";
import TierList from "@/components/pricing/tier-list";
import { useState } from "react";

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <main className="container mx-auto px-4 py-20 pb-32">
        <HeroTextPricing billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
        <TierList billingCycle={billingCycle} />
      </main>
      <Footer />
    </section>
  );
};

export default PricingPage;
