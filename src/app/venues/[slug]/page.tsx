import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { EventGrid } from "@/components/EventGrid";
import {
  cityPath,
  fetchVenue,
  place,
  type PublicEvent,
} from "@/lib/events";
import { externalUrl } from "@/lib/externalUrl";
import { jsonLd } from "@/lib/jsonLd";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const site = eventSiteForHost(headers().get("host"));
  const venue = await fetchVenue(params.slug);
  if (!venue) return { title: "Venue not found", robots: { index: false } };

  const count = venue.events.length;

  return {
    title: `${venue.venue}, ${place(venue)} — ${count} upcoming desi ${
      count === 1 ? "event" : "events"
    }`,
    description: `Everything coming up at ${venue.venue} in ${place(
      venue,
    )}: dates, line-ups, ticket prices and directions. ${count} upcoming ${
      count === 1 ? "event" : "events"
    }.`,
    alternates: { canonical: `https://${site.domain}/venues/${venue.slug}` },
  };
}

export default async function VenuePage({
  params,
}: {
  params: { slug: string };
}) {
  const site = eventSiteForHost(headers().get("host"));
  const venue = await fetchVenue(params.slug);
  if (!venue) notFound();

  const maps = externalUrl(venue.mapsUrl);
  const types = Array.from(
    new Set(
      venue.events
        .map((event) => event.eventType)
        .filter((type): type is string => Boolean(type)),
    ),
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <nav className="text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:underline">
          {site.name}
        </Link>{" "}
        ›{" "}
        <Link href="/venues" className="hover:underline">
          Venues
        </Link>{" "}
        › <span className="text-slate-700">{venue.venue}</span>
      </nav>

      <header
        className={`rounded-3xl bg-gradient-to-r ${site.gradient} px-5 py-8 text-white sm:px-8`}
      >
        <p className="text-xs font-black uppercase tracking-wide text-white/80">
          Venue
        </p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">{venue.venue}</h1>
        <p className="mt-2 text-white/90">
          {venue.address ? `${venue.address}, ` : ""}
          {place(venue)} · {venue.events.length} upcoming{" "}
          {venue.events.length === 1 ? "event" : "events"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          {maps ? (
            <a
              href={maps}
              target="_blank"
              rel="noopener nofollow"
              className="rounded-xl bg-white px-4 py-2.5 text-slate-900 hover:bg-slate-100"
            >
              📍 Directions
            </a>
          ) : null}
          <Link
            href={cityPath(venue.city)}
            className="rounded-xl border border-white/50 px-4 py-2.5 hover:bg-white/15"
          >
            All events in {venue.city}
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-black">
          What&apos;s on at {venue.venue}
        </h2>
        <p className="max-w-3xl text-sm text-slate-600">
          {venue.events.length === 1
            ? "One event is currently on the calendar here"
            : `${venue.events.length} events are currently on the calendar here`}
          {types.length ? ` — ${types.join(", ").toLowerCase()}` : ""}. Each
          event has its own page on {site.name} with the schedule, line-up and
          ticket prices; booking happens on Godesi.com.
        </p>
        <EventGrid events={venue.events} accent={site.accent} />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-black">
          Holding your event at {venue.venue}?
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Post it free on Godesi.com and it appears on this venue page, on the{" "}
          {venue.city} page and in search here — with tickets and QR check-in
          handled on Godesi.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-black">
          <a
            href={godesiUrl("/events/new")}
            target="_blank"
            rel="noopener"
            className={site.accent}
          >
            Post your event free →
          </a>
          <Link href="/list-your-event" className={site.accent}>
            Fees and where you get listed →
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Place",
            name: venue.venue,
            address: {
              "@type": "PostalAddress",
              streetAddress: venue.address ?? undefined,
              addressLocality: venue.city,
              addressRegion: venue.state ?? undefined,
            },
            hasMap: maps ?? undefined,
            event: venue.events.slice(0, 20).map((event: PublicEvent) => ({
              "@type": "Event",
              name: event.title,
              startDate: event.startsAt,
              url: `https://${site.domain}/events/${event.slug}`,
            })),
          }),
        }}
      />
    </main>
  );
}
