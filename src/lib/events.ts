import { godesiUrl } from "./sites";

export type PublicEvent = {
  slug: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  venue: string;
  hallName: string | null;
  address: string | null;
  mapsUrl: string | null;
  city: string;
  state: string | null;
  country: string | null;
  features: string[];
  tags: string[];
  eventType: string | null;
  mode: "OFFLINE" | "ONLINE" | "HYBRID" | string;
  onlineUrl: string | null;
  organizerWebsite: string | null;
  bonusNote: string | null;
  recurrence: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  albumUrl: string | null;
  price: number;
  currency: string;
  seatsTotal: number;
  seatsLeft: number;
  soldOut: boolean;
  categorySlug: string | null;
  categorySlugs: string[];
  organizer: string | null;
  organizerUrl: string | null;
  speakers: { name: string; photoUrl: string | null; bio: string | null }[];
  sessions: {
    title: string;
    stage: string | null;
    speaker: string | null;
    startTime: string | null;
    endTime: string | null;
  }[];
  tiers: { name: string; price: number; seatsLeft: number }[];
  updatedAt: string;
  createdAt: string;
  /** The Godesi page where tickets are actually sold. */
  ticketUrl: string;
};

export type Facet = { city: string; state: string | null; count: number };
export type TypeFacet = { type: string; count: number };

/** Tags every click through to Godesi so the referral shows up in analytics. */
const REF = "eventringer";

async function read<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(godesiUrl(path), { next: { revalidate: 600 } });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchEvents(query: Record<string, string> = {}) {
  const params = new URLSearchParams({ ref: REF, ...query });
  const payload = await read<{ items?: PublicEvent[]; total?: number }>(
    `/api/events?${params}`,
    {},
  );

  return { items: payload.items ?? [], total: payload.total ?? 0 };
}

/** Upcoming events plus the city and type counts used for landing pages. */
export async function fetchEventFacets() {
  const params = new URLSearchParams({ ref: REF, facets: "1", limit: "1" });
  const payload = await read<{ cities?: Facet[]; types?: TypeFacet[] }>(
    `/api/events?${params}`,
    {},
  );

  return { cities: payload.cities ?? [], types: payload.types ?? [] };
}

export async function fetchEvent(slug: string) {
  return read<PublicEvent | null>(
    `/api/events/${encodeURIComponent(slug)}?ref=${REF}`,
    null,
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function eventPath(event: PublicEvent) {
  return `/events/${event.slug}`;
}

export function cityPath(city: string) {
  return `/events/in/${slugify(city)}`;
}

export function typePath(type: string) {
  return `/events/type/${slugify(type)}`;
}

export function place(event: {
  city: string;
  state: string | null;
  country?: string | null;
}) {
  return [event.city, event.state].filter(Boolean).join(", ");
}

export function priceLabel(event: PublicEvent) {
  const cheapest = event.tiers.length
    ? Math.min(...event.tiers.map((tier) => tier.price))
    : event.price;
  if (!cheapest) return "Free entry";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: event.currency || "USD",
    maximumFractionDigits: 0,
  }).format(cheapest);

  return event.tiers.length > 1 ? `From ${formatted}` : formatted;
}

export function dateLabel(value: string, withTime = false) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime
      ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" }
      : {}),
  });
}

/** Publishers that refuse hot-linking still render through Godesi's proxy. */
export function picture(url: string | null) {
  if (!url) return null;
  return url.includes(".public.blob.vercel-storage.com")
    ? url
    : godesiUrl(`/api/img?u=${encodeURIComponent(url)}`);
}
