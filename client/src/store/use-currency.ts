import { create } from "zustand";

type CurrencyState = {
  currency: "IDR" | "USD";
  setCurrency: (currency: "IDR" | "USD") => void;
};

// Initial state will be read from the cookie if we hydrate this on the client,
// but Zustand stores are initialized instantly. We will provide a way to sync it.
export const useCurrency = create<CurrencyState>((set) => ({
  currency: "IDR", // Default, will be hydrated later or match SSR
  setCurrency: (currency) => {
    // 1. Update Cookie
    document.cookie = `USER_CURRENCY=${currency}; path=/; max-age=31536000`; // 1 year expiry
    // 2. Update State
    set({ currency });
    // Note: We will call router.refresh() from the component where this is triggered
    // so Next.js server components fetch the new cookie and re-render.
  },
}));
