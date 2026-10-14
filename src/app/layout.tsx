import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalBoost — Your business's online presence, on autopilot",
  description: "Review inbox, Google Business autopilot, competitor watch, and visibility score for local businesses.",
  openGraph: {
    title: "LocalBoost — Your business's online presence, on autopilot",
    description: "We build websites, handle reviews & bookings for local businesses. 30-day free trial.",
    url: "https://www.localboost.site",
    siteName: "LocalBoost",
    images: [
      {
        url: "https://www.localboost.site/logo-v2.webp",
        width: 1200,
        height: 630,
        alt: "LocalBoost",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalBoost — Your business's online presence, on autopilot",
    description: "We build websites, handle reviews & bookings for local businesses. 30-day free trial.",
    images: ["https://www.localboost.site/logo-v2.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
