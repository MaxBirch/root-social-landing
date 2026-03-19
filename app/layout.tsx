import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free Ad Account Audit — Root Social",
  description: "We don't run ads. We build revenue engines. Get your free paid social audit from Root Social's expert team.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Free Ad Account Audit — Root Social",
    description: "Paid social that actually scales. Book your free 30-minute audit today.",
    siteName: "Root Social",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
