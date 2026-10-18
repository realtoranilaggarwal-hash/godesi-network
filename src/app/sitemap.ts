import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import {
  cityPath,
  fetchEventFacets,
  fetchEvents,
  fetchVenues,
  typePath,
} from "@/lib/events";
import { fetchChatter, tagPath } from "@/lib/chatter";
import { GUIDES } from "@/lib/guides";
import { fetchAgents } from "@/lib/realEstate";
import { siteForHost } from "@/lib/sites";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteForHost(headers().get("host"));
  const base = `https://${site.domain}`;

  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Event sites host the pages themselves, so every event, city and type gets
  // its own indexable URL here instead of a link out to godesi.com.
  if (site.eventPages) {
    const [{ items }, { cities, types }, venues] = await Promise.all([
      fetchEvents({ limit: "200" }),
      fetchEventFacets(),
      fetchVenues(),
    ]);

    entries.push(
      { url: `${base}/events`, changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/venues`, changeFrequency: "daily", priority: 0.8 },
      {
        url: `${base}/list-your-event`,
        changeFrequency: "monthly",
        priority: 0.7,
      },
    );

    for (const venue of venues) {
      entries.push({
        url: `${base}/venues/${venue.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const city of cities) {
      entries.push({
        url: `${base}${cityPath(city.city)}`,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }

    for (const type of types) {
      entries.push({
        url: `${base}${typePath(type.type)}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const event of items) {
      entries.push({
        url: `${base}/events/${event.slug}`,
        lastModified: new Date(event.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // Gapodi's own hubs; single posts are canonical on godesi.com, so they stay out.
  if (site.kind === "chatter") {
    const { topics, trending } = await fetchChatter();
    for (const topic of topics) {
      entries.push({
        url: `${base}/topic/${topic.id}`,
        changeFrequency: "hourly",
        priority: 0.8,
      });
    }
    for (const item of trending) {
      entries.push({
        url: `${base}${tagPath(item.tag)}`,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  }

  if (site.kind === "guide") {
    for (const guide of GUIDES) {
      entries.push({
        url: `${base}/guides/${guide.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  if (site.kind === "realestate") {
    const { items } = await fetchAgents({ limit: "200" });
    entries.push(
      { url: `${base}/agents`, changeFrequency: "daily", priority: 0.9 },
      { url: `${base}/properties`, changeFrequency: "daily", priority: 0.8 },
      { url: `${base}/for-agents`, changeFrequency: "monthly", priority: 0.6 },
    );
    for (const agent of items) {
      entries.push({
        url: `${base}/agents/${agent.slug}`,
        lastModified: new Date(agent.updatedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
