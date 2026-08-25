import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { AdSlot } from "@/components/AdSlot";
import { dayChip, fetchVenues, place } from "@/lib/events";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  const site = eventSiteForHost(headers().get("host"));

  return {
    title: "Venues hosting desi events — halls, temples and theatres",
    description:
      "Every venue with an upcoming South Asian community event: banquet halls, temples, community centres, theatres and clubs, with how many events are coming up and directions.",
    alternates: { canonical: `https://${site.domain}/venues` },
  };
}

export default async function VenuesIndex() {
  const site = eventSiteForHost(headers().get("host"));
  const venues = await fetchVenues();
  const cities = new Set(venues.map((venue) => place(venue)));

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <header className="space-y-2">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Where it all happens
        </p>
        <h1 className="text-3xl font-black sm:text-4xl">
          Venues hosting desi events
        </h1>
        <p className="max-w-3xl text-slate-600">
          {venues.length} {venues.length === 1 ? "venue" : "venues"} across{" "}
          {cities.size} {cities.size === 1 ? "city" : "cities"} have an upcoming
          community event — banquet halls, temples, community centres, school
          auditoriums, theatres and clubs. Pick a venue to see everything coming
          up there, with directions and ticket prices.
        </p>
      </header>

      {venues.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <li key={venue.slug}>
              <Link
                href={`/venues/${venue.slug}`}
                className="flex h-full flex-col gap-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-2xl" aria-hidden>
                  🏛️
                </span>
                <span className="text-base font-black leading-snug text-slate-900">
                  {venue.venue}
                </span>
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {place(venue)}
                </span>
                <span className="mt-auto pt-2 text-sm font-bold text-slate-700">
                  {venue.events.length} upcoming{" "}
                  {venue.events.length === 1 ? "event" : "events"}
                </span>
                <span className={`text-xs font-black ${site.accent}`}>
                  Next: {dayChip(venue.events[0].startsAt)} ·{" "}
                  {venue.events[0].title} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No venues listed yet.{" "}
          <a
            href={godesiUrl("/events/new")}
            target="_blank"
            rel="noopener"
            className={`font-bold ${site.accent}`}
          >
            List your event free
          </a>{" "}
          and your venue gets its own page here.
        </div>
      )}

      <AdSlot accent={site.accent} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-black">Run a hall or community centre?</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Every event posted on Godesi.com names its venue, and that venue gets a
          page here listing everything coming up at it — free, and it keeps
          working after the event is over.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-black">
          <Link href="/list-your-event" className={site.accent}>
            How listing works →
          </Link>
          <a
            href={godesiUrl("/events/new")}
            target="_blank"
            rel="noopener"
            className={site.accent}
          >
            Post an event free →
          </a>
        </div>
      </section>
    </main>
  );
}
