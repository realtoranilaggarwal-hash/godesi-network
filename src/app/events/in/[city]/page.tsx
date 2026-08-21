import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { EventGrid } from "@/components/EventGrid";
import { cityIntro } from "@/lib/eventCopy";
import {
  cityPath,
  fetchEventFacets,
  fetchEvents,
  slugify,
  typePath,
  type Facet,
} from "@/lib/events";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

/** Resolves a URL slug back to the city as organisers spelled it. */
async function resolve(slug: string) {
  const { cities, types } = await fetchEventFacets();
  const match = cities.find((city) => slugify(city.city) === slug);
  return { match, cities, types };
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const site = eventSiteForHost(headers().get("host"));
  const { match } = await resolve(params.city);
  if (!match) return { title: "City not found", robots: { index: false } };

  const where = [match.city, match.state].filter(Boolean).join(", ");

  return {
    title: `Desi events in ${where} — festivals, concerts & garba nights`,
    description: `${match.count} upcoming South Asian community events in ${where}: melas, garba and bhangra nights, concerts, pujas, workshops and meetups, with venues, dates and ticket prices.`,
    alternates: { canonical: `https://${site.domain}${cityPath(match.city)}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const site = eventSiteForHost(headers().get("host"));
  const { match, cities, types } = await resolve(params.city);
  if (!match) notFound();

  const where = [match.city, match.state].filter(Boolean).join(", ");
  const { items } = await fetchEvents({ city: match.city, limit: "48" });

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <nav className="text-xs font-semibold text-slate-500">
        <Link href="/events" className="hover:underline">
          Events
        </Link>{" "}
        › <span className="text-slate-700">{where}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-black sm:text-4xl">
          Desi events in {where}
        </h1>
        <p className="max-w-3xl text-slate-600">
          {cityIntro(match.city, match.state, match.count)}
        </p>
      </header>

      <EventGrid events={items} accent={site.accent} />

      <AdSlot accent={site.accent} />

      <section className="space-y-3">
        <h2 className="text-xl font-black">Browse by type in {match.city}</h2>
        <ul className="flex flex-wrap gap-2">
          {types.map((type) => (
            <li key={type.type}>
              <Link
                href={typePath(type.type)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {type.type}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">Other cities</h2>
        <ul className="flex flex-wrap gap-2">
          {cities
            .filter((city: Facet) => city.city !== match.city)
            .slice(0, 40)
            .map((city) => (
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

      <p className="text-sm text-slate-600">
        Hosting something in {match.city}?{" "}
        <a
          href={godesiUrl("/events/new")}
          target="_blank"
          rel="noopener"
          className={`font-bold ${site.accent}`}
        >
          List it free on Godesi.com
        </a>{" "}
        and it appears on this page.
      </p>
    </main>
  );
}
