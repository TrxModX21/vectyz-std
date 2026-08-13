import "./globals.css";
import type { Metadata } from "next";
import { Audiowide, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/uitripled/notification-center-shadcnui";
import { MotionConfig } from "framer-motion";
import Crosshair from "@/components/neonblade-ui/crosshair";
import ReactQueryProvider from "@/lib/react-query";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Vectolio Dashboard",
  description: "Vectolio — Futuristic Cyberpunk Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", inter.variable, audiowide.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <MotionConfig
              reducedMotion={
                process.env.NODE_ENV === "production" ? "user" : "never"
              }
            >
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </MotionConfig>
          </NuqsAdapter>
          <Toaster />

          <Crosshair
            color="green"
            arcGap={0.15}
            outerSpeed={1.5}
            innerSpeed={1}
            crosshairSize={4}
            glowIntensity="low"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
