import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-vazirmatn",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bargdanesh.ir"),
  title: {
    default: "برگ دانش | دانش، یک برگ فاصله دارد",
    template: "%s | برگ دانش",
  },
  description:
    "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله دانشگاهی و مدرسه‌ای — برگ دانش",
  authors: [{ name: "برگ دانش" }],
  creator: "برگ دانش",
  publisher: "برگ دانش",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://www.bargdanesh.ir",
    siteName: "برگ دانش",
    title: "برگ دانش | دانش، یک برگ فاصله دارد",
    description:
      "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله دانشگاهی و مدرسه‌ای",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "برگ دانش",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "برگ دانش | دانش، یک برگ فاصله دارد",
    description:
      "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله دانشگاهی و مدرسه‌ای",
    images: ["/android-chrome-512x512.png"],
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
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={vazirmatn.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>

        {/* Structured Data — WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "برگ دانش",
              url: "https://www.bargdanesh.ir",
              description:
                "مرجع دانلود رایگان جزوه، کتاب، نمونه سوال و مقاله دانشگاهی و مدرسه‌ای",
              inLanguage: "fa-IR",
              publisher: {
                "@type": "Organization",
                name: "برگ دانش",
                url: "https://www.bargdanesh.ir",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.bargdanesh.ir/android-chrome-512x512.png",
                },
              },
            }),
          }}
        />
      </body>
    </html>
  );
}