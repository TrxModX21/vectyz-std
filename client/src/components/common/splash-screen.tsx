"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import vectyzLogo from "../../app/icon.png";
import Image from "next/image";

const SplashScreen = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms splash duration

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="relative"
            >
              {/* Logo / Brand */}
              <div className="flex items-center gap-2">
                <div className="h-12 w-12 rounded-xl border border-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-primary-foreground"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg> */}
                  <div className="relative h-10 w-10">
                    <Image
                      src={vectyzLogo}
                      alt="Vectyz logomark"
                      fill
                      className="h-full w-auto"
                      loading="eager"
                      priority
                    />
                  </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Vectyz<span className="text-primary">.</span>
                </h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ delay: 0.2, duration: 0.4, repeat: Infinity }}
              className="h-1 rounded-full bg-linear-to-r from-primary to-secondary"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
