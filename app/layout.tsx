import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { MobileCallButton } from "@/components/MobileCallButton";
import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/lib/config";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.steptechinnovation.com");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${siteConfig.companyName} | Business Technology Solutions`,
    template: `%s`,
  },
  description:
    "Custom workflow automation, scheduling systems, and dashboards for Florida service businesses.",
  openGraph: {
    title: `${siteConfig.companyName} | Business Technology Solutions`,
    description:
      "Reduce admin labor, eliminate scheduling chaos, and speed up invoicing with custom systems.",
    url: metadataBase,
    siteName: siteConfig.companyName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.companyName} marketing banner`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
        <MobileCallButton />
      </body>
    </html>
  );
}
