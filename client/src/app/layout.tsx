import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/provider/react-query-provider";
import DisableInspect from "@/components/common/disable-inspect";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <ReactQueryProvider>
          <DisableInspect />
          {children}
        </ReactQueryProvider>

        <Toaster richColors position="top-center" theme="dark" />
      </body>
    </html>
  );
}
