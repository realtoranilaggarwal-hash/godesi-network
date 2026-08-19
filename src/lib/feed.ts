import { godesiUrl } from "./sites";

export type NewsItem = {
  id: string;
  title: string;
  teaser: string;
  imageUrl: string | null;
  topic: string;
  city: string | null;
  state: string | null;
  country: string | null;
  source: string;
  publishedAt: string;
  url: string;
};

export type EventItem = {
  slug: string;
  title: string;
  teaser: string;
  imageUrl: string | null;
  startsAt: string;
  endsAt: string | null;
  venue: string;
  city: string;
  state: string | null;
  country: string | null;
  eventType: string | null;
  categorySlug: string | null;
  url: string;
};

export type BusinessItem = {
  slug: string;
  name: string;
  teaser: string;
  logoUrl: string | null;
  city: string;
  state: string | null;
  country: string | null;
  categorySlug: string | null;
  subcategory: string | null;
  claimed: boolean;
  featured: boolean;
  url: string;
};

/** An open requirement on Godesi — a job, bench need or buyer enquiry. */
export type LeadItem = {
  id: string;
  title: string;
  teaser: string;
  category: string;
  categorySlug: string | null;
  city: string;
  budgetMin: number | null;
  budgetMax: number | null;
  postedAt: string;
  url: string;
};

/** A GoDesi Elite profile: a recognised desi leader, claimed or waiting. */
export type EliteItem = {
  slug: string;
  name: string;
  org: string | null;
  teaser: string;
  category: string;
  city: string;
  state: string | null;
  country: string | null;
  imageUrl: string | null;
  badge: string;
  claimed: boolean;
  sourceUrl: string | null;
  sourceName: string | null;
  publishedAt: string;
  url: string;
  claimUrl: string;
};

export type FeedItem =
  | NewsItem
  | EventItem
  | BusinessItem
  | LeadItem
  | EliteItem;

export function isLead(item: FeedItem): item is LeadItem {
  return "postedAt" in item;
}

export function isElite(item: FeedItem): item is EliteItem {
  return "claimUrl" in item;
}

export function isNews(item: FeedItem): item is NewsItem {
  return "publishedAt" in item && !isElite(item);
}

export function isEvent(item: FeedItem): item is EventItem {
  return "startsAt" in item;
}

/**
 * Reads Godesi's public feed. A failure here must never take the site down —
 * the section just renders empty with a link through to godesi.com.
 */
export async function fetchFeed(query: Record<string, string>) {
  const params = new URLSearchParams(query);

  try {
    const response = await fetch(godesiUrl(`/api/feed?${params}`), {
      next: { revalidate: 600 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { items?: FeedItem[] };
    return payload.items ?? [];
  } catch {
    return [];
  }
}
