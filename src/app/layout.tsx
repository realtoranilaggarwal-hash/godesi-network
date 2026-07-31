import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { godesiUrl, siteForHost } from "@/lib/sites";

const inter = Inter({ subsets: ["latin"] });

export function generateMetadata(): Metadata {
  const site = siteForHost(headers().get("host"));

  return {
    metadataBase: new URL(`https://${site.domain}`),
    title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
    alternates: { canonical: `https://${site.domain}` },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = siteForHost(headers().get("host"));
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en">
      {adsenseClient ? (
        <head>
          <Script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="afterInteractive"
          />
        </head>
      ) : null}
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: site.name,
              url: `https://${site.domain}`,
              description: site.description,
              isPartOf: { "@type": "WebSite", name: "Godesi", url: godesiUrl() },
            }),
          }}
        />
        <SiteHeader site={site} />
        {children}
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
