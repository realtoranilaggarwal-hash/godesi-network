import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { EventGrid } from "@/components/EventGrid";
import {
  cityPath,
  fetchEventFacets,
  fetchEvents,
  slugify,
  typePath,
} from "@/lib/events";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

async function resolve(slug: string) {
  const { cities, types } = await fetchEventFacets();
  const match = types.find((type) => slugify(type.type) === slug);
  return { match, cities, types };
}

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}): Promise<Metadata> {
  const site = eventSiteForHost(headers().get("host"));
  const { match } = await resolve(params.type);
  if (!match) return { title: "Not found", robots: { index: false } };

  return {
    title: `${match.type} — upcoming desi events`,
    description: `${match.count} upcoming ${match.type.toLowerCase()} events in the South Asian community, with dates, venues, line-ups and ticket prices.`,
    alternates: { canonical: `https://${site.domain}${typePath(match.type)}` },
  };
}

export default async function TypePage({
  params,
}: {
  params: { type: string };
}) {
  const site = eventSiteForHost(headers().get("host"));
  const { match, cities, types } = await resolve(params.type);
  if (!match) notFound();

  const { items } = await fetchEvents({ type: match.type, limit: "48" });

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <nav className="text-xs font-semibold text-slate-500">
        <Link href="/events" className="hover:underline">
          Events
        </Link>{" "}
        › <span className="text-slate-700">{match.type}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-black sm:text-4xl">
          {match.type} events near you
        </h1>
        <p className="max-w-3xl text-slate-600">
          {match.count} upcoming {match.type.toLowerCase()}{" "}
          {match.count === 1 ? "event" : "events"} posted by organisers in the
          desi community. Each one has its own page here with the date, venue,
          line-up, what is included and ticket prices — tickets are booked on
          Godesi.com.
        </p>
      </header>

      <EventGrid events={items} accent={site.accent} />

      <AdSlot accent={site.accent} />

      <section className="space-y-3">
        <h2 className="text-xl font-black">Cities with events coming up</h2>
        <ul className="flex flex-wrap gap-2">
          {cities.slice(0, 40).map((city) => (
            <li key={`${city.city}-${city.state}`}>
              <Link
                href={cityPath(city.city)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {[city.city, city.state].filter(Boolean).join(", ")} (
                {city.count})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">Other kinds of events</h2>
        <ul className="flex flex-wrap gap-2">
          {types
            .filter((type) => type.type !== match.type)
            .map((type) => (
              <li key={type.type}>
                <Link
                  href={typePath(type.type)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {type.type} ({type.count})
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <p className="text-sm text-slate-600">
        Running a {match.type.toLowerCase()} event?{" "}
        <a
          href={godesiUrl("/events/new")}
          target="_blank"
          rel="noopener"
          className={`font-bold ${site.accent}`}
        >
          List it free on Godesi.com
        </a>
        .
      </p>
    </main>
  );
}
