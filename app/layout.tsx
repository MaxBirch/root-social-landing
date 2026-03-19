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
  title: "Is Your Ad Budget Leaking? Get a Free Audit — Root Social",
  description: "We identify exactly where your paid social budget is wasting — then show you what we'd fix in 30 days. Free audit, no commitment. 50+ brands scaled, £20M+ revenue generated.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Find Out Where Your Ad Budget Is Leaking — Free Audit",
    description: "Root Social reviews your full ad account and shows you what's wasting your budget. 100% free, no commitment.",
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
