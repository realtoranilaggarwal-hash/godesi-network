import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteForHost } from "@/lib/sites";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteForHost(headers().get("host"));
  const base = `https://${site.domain}`;

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
