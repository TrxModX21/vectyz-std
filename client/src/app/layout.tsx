import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/providers/react-query-provider";
import DisableInspect from "@/components/common/disable-inspect";
import { SocketProvider } from "@/providers/socket-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Vectolio - High Quality Digital Assets", // Title default jika halaman tidak punya title
    template: "%s | Vectolio", // %s akan diganti dengan title dari halaman child
  },
  description:
    "Download free vectors, photos, and PSD files on Vectolio. High-quality digital assets for your creative projects.",
  keywords: [
    "vectors",
    "free vectors",
    "photos",
    "PSD",
    "digital assets",
    "design resources",
  ],
  authors: [{ name: "Vectolio Team" }],
  creator: "Vectolio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Vectolio",
    title: "Vectolio - High Quality Digital Assets",
    description:
      "Download free vectors, photos, and PSD files on Vectolio. High-quality digital assets for your creative projects.",
    images: [
      {
        url: "/logo.png", // Kita perlu menyiapkan gambar ini di folder /public
        width: 1200,
        height: 630,
        alt: "Vectolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectolio - High Quality Digital Assets",
    description:
      "Download free vectors, photos, and PSD files on Vectolio. High-quality digital assets for your creative projects.",
    images: ["/logo.png"], // Sama dengan OG image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-1874162807627805",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1874162807627805"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${montserrat.className} antialiased`}>
        <ReactQueryProvider>
          <SocketProvider>
            <DisableInspect />
            <TooltipProvider>{children}</TooltipProvider>
            {process.env.NODE_ENV === "production" && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
            )}
          </SocketProvider>
        </ReactQueryProvider>

        <Toaster position="top-center" theme="light" />
      </body>
    </html>
  );
}
