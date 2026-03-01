import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.steptechinnovation.com";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.companyName}`;
  const url = new URL(path, baseUrl).toString();

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.companyName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${siteConfig.companyName} workflow automation services`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og-image.svg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
