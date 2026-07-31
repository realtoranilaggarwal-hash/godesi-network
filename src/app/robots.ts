import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteForHost } from "@/lib/sites";

export default function robots(): MetadataRoute.Robots {
  const site = siteForHost(headers().get("host"));

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `https://${site.domain}/sitemap.xml`,
  };
}
