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

export type VenueGroup = {
  slug: string;
  venue: string;
  city: string;
  state: string | null;
  address: string | null;
  mapsUrl: string | null;
  events: PublicEvent[];
};

/** Two venues can share a name across cities, so the city is part of the key. */
export function venueSlug(event: { venue: string; city: string }) {
  return slugify(`${event.venue} ${event.city}`);
}

export function venuePath(event: { venue: string; city: string }) {
  return `/venues/${venueSlug(event)}`;
}

/**
 * "Which halls near me actually host desi events" is its own search, and the
 * API has no venue facet — so the calendar is grouped here, once, and the
 * fetch cache keeps every venue page on the same upstream call.
 */
export async function fetchVenues() {
  const { items } = await fetchEvents({ limit: "200" });
  const groups = new Map<string, VenueGroup>();

  for (const event of items) {
    if (!event.venue || event.mode === "ONLINE") continue;
    const slug = venueSlug(event);
    const group = groups.get(slug);
    if (group) {
      group.events.push(event);
      group.address ??= event.address;
      group.mapsUrl ??= event.mapsUrl;
      continue;
    }
    groups.set(slug, {
      slug,
      venue: event.venue,
      city: event.city,
      state: event.state,
      address: event.address,
      mapsUrl: event.mapsUrl,
      events: [event],
    });
  }

  return Array.from(groups.values()).sort(
    (a, b) =>
      b.events.length - a.events.length ||
      new Date(a.events[0].startsAt).getTime() -
        new Date(b.events[0].startsAt).getTime(),
  );
}

export async function fetchVenue(slug: string) {
  return (await fetchVenues()).find((venue) => venue.slug === slug) ?? null;
}

/** A compact date chip: "Sat 23 Aug". */
export function dayChip(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function timeChip(value: string) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** How soon it is, in the words people scan for. */
export function whenBadge(value: string) {
  const days = Math.round(
    (new Date(value).getTime() - Date.now()) / 86_400_000,
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return "This week";
  if (days <= 14) return "Next week";
  return null;
}

/**
 * A finished event keeps its page (people still search for it) but must not be
 * indexed or advertised as bookable, and it is gone from every listing.
 */
export function hasEnded(event: PublicEvent) {
  return new Date(event.endsAt ?? event.startsAt).getTime() < Date.now();
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
