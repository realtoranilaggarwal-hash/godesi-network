import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { AdSlot } from "@/components/AdSlot";
import { EventGrid } from "@/components/EventGrid";
import {
  cityPath,
  fetchEventFacets,
  fetchEvents,
  typePath,
} from "@/lib/events";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

const PAGE_SIZE = 36;

export function generateMetadata(): Metadata {
  const site = eventSiteForHost(headers().get("host"));

  return {
    title: `Upcoming desi events — festivals, concerts and meetups`,
    description:
      "The full calendar of upcoming South Asian community events: festivals and melas, garba nights, concerts, pujas, workshops and meetups, with venues, ticket prices and directions.",
    alternates: { canonical: `https://${site.domain}/events` },
  };
}

export default async function EventsIndex({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const site = eventSiteForHost(headers().get("host"));
  const page = Math.max(Number(searchParams.page ?? 1) || 1, 1);
  const query = searchParams.q?.trim();

  const [{ items, total }, { cities, types }] = await Promise.all([
    fetchEvents({
      limit: String(PAGE_SIZE),
      offset: String((page - 1) * PAGE_SIZE),
      ...(query ? { q: query } : {}),
    }),
    fetchEventFacets(),
  ]);

  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black sm:text-4xl">
          {query ? `Desi events matching “${query}”` : "Upcoming desi events"}
        </h1>
        <p className="max-w-3xl text-slate-600">
          {total} upcoming {total === 1 ? "event" : "events"} listed by
          organisers across the community — festivals and melas, garba and
          bhangra nights, concerts, temple programmes, workshops, conferences
          and family days out. Every event has its own page here with the
          schedule, line-up, venue and ticket prices; booking happens on
          Godesi.com.
        </p>
      </header>

      <EventGrid events={items} accent={site.accent} />

      {pages > 1 ? (
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          {Array.from({ length: pages }, (_, index) => index + 1).map((n) => (
            <Link
              key={n}
              href={`/events?page=${n}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
              className={`rounded-lg border px-3 py-1.5 ${
                n === page
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      ) : null}

      <AdSlot accent={site.accent} />

      <section className="space-y-3">
        <h2 className="text-xl font-black">Events by city</h2>
        <ul className="flex flex-wrap gap-2">
          {cities.map((city) => (
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
        <h2 className="text-xl font-black">Events by type</h2>
        <ul className="flex flex-wrap gap-2">
          {types.map((type) => (
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
        Organising an event?{" "}
        <a
          href={godesiUrl("/events/new")}
          target="_blank"
          rel="noopener"
          className={`font-bold ${site.accent}`}
        >
          List it free on Godesi.com
        </a>{" "}
        and it is published here with its own page.
      </p>
    </main>
  );
}
