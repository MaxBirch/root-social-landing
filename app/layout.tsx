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
  title: "Is Your Ad Budget Leaking? Get a Free Audit  -  Root Social",
  description: "We identify exactly where your paid social budget is wasting  -  then show you what we'd fix in 30 days. Free audit, no commitment. 50+ brands scaled, £20M+ revenue generated.",
  robots: "noindex, nofollow",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Find Out Where Your Ad Budget Is Leaking  -  Free Audit",
    description: "Root Social reviews your full ad account and shows you what's wasting your budget. 100% free, no commitment.",
    siteName: "Root Social",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Root Social  -  Free Ad Account Audit",
      },
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Root Social LTD",
  description: "Paid social marketing agency helping e-commerce and DTC brands scale profitably through Meta and Instagram advertising.",
  url: "https://get.root-social.com",
  logo: "https://get.root-social.com/logo.png",
  email: "hello@root-social.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kidderminster",
    addressRegion: "Worcestershire",
    addressCountry: "GB",
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  knowsAbout: ["Paid Social Advertising", "Meta Ads", "Facebook Ads", "Instagram Ads", "E-commerce Marketing", "DTC Advertising"],
  sameAs: ["https://www.instagram.com/root_social"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
