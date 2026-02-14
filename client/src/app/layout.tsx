import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/provider/react-query-provider";
import Script from "next/script";
import SplashScreen from "@/components/common/splash-screen";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Vectyz - High Quality Digital Assets",
  description: "Download free vectors, photos, and PSD files on Vectyz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <Script
          async
          strategy="afterInteractive"
          type="text/javascript"
          src="//e.crmrkt.com/product_embed.js"
          crossOrigin="anonymous"
        />
      </head> */}
      <body className={`${montserrat.className} antialiased`}>
        <ReactQueryProvider>
          <SplashScreen />
          {children}
        </ReactQueryProvider>

        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
}
