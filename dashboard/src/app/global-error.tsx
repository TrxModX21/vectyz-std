"use client";

import { Audiowide, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ErrorClient from "@/components/dashboard/error-client";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased dark",
        audiowide.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-[#04040A] text-[#EEEEF6]">
        <ErrorClient error={error} reset={reset} isGlobal />
      </body>
    </html>
  );
}
