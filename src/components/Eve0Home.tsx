import Link from "next/link";
import { EventGrid } from "@/components/EventGrid";
import { SiteSearch } from "@/components/SiteSearch";
import {
  cityPath,
  dayChip,
  fetchEventFacets,
  fetchEvents,
  picture,
  place,
  shortPath,
  typePath,
  type PublicEvent,
} from "@/lib/events";
import { godesiUrl, type SiteConfig } from "@/lib/sites";

/** Search on top, the big events with their short links, then small cards. */
export async function Eve0Home({ site }: { site: SiteConfig }) {
  const [{ items, total }, { cities, types }] = await Promise.all([
    fetchEvents({ limit: "48" }),
    fetchEventFacets(),
  ]);
  const bigSlugs = Array.from(new Set(Object.values(site.shortLinks ?? {})));
  const big = bigSlugs
    .map((slug) => items.find((event) => event.slug === slug))
    .filter((event): event is PublicEvent => Boolean(event));

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-5">
      <section
        className={`rounded-3xl bg-gradient-to-r ${site.gradient} px-5 py-6 text-white sm:px-8`}
      >
        <h1 className="text-2xl font-black sm:text-3xl">{site.tagline}</h1>
        <p className="mt-1 text-sm text-white/90">
          {total} upcoming {total === 1 ? "event" : "events"} · tickets on
          Godesi.com
        </p>
        {site.search ? (
          <SiteSearch
            placeholder={site.search.placeholder}
            suggestions={site.search.suggestions}
          />
        ) : null}
      </section>

      {big.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-black">Big events</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {big.map((event) => {
              const image = picture(event.imageUrl);
              const short = shortPath(event, site.shortLinks);
              return (
                <div
                  key={event.slug}
                  className="flex gap-3 rounded-2xl border-2 border-rose-200 bg-white p-3 shadow-sm"
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={event.title}
                      className="h-24 w-20 shrink-0 rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={`/events/${event.slug}`}
                      className="line-clamp-2 text-sm font-black text-slate-900 hover:underline"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {dayChip(event.startsAt)} · {place(event)}
                    </p>
                    <a
                      href={short}
                      className={`inline-block rounded-lg bg-rose-50 px-2 py-1 text-sm font-black ${site.accent}`}
                    >
                      {site.domain}
                      {short}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-lg font-black">Upcoming events</h2>
          <Link href="/events" className={`text-sm font-bold ${site.accent}`}>
            Full calendar →
          </Link>
        </div>
        <EventGrid events={items} accent={site.accent} compact />
      </section>

      {types.length ? (
        <section className="space-y-2">
          <h2 className="text-base font-black">By type</h2>
          <ul className="flex flex-wrap gap-1.5">
            {types.map((type) => (
              <li key={type.type}>
                <Link
                  href={typePath(type.type)}
                  className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {type.type} ({type.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {cities.length ? (
        <section className="space-y-2">
          <h2 className="text-base font-black">By city</h2>
          <ul className="flex flex-wrap gap-1.5">
            {cities.slice(0, 40).map((city) => (
              <li key={`${city.city}-${city.state}`}>
                <Link
                  href={cityPath(city.city)}
                  className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {[city.city, city.state].filter(Boolean).join(", ")} (
                  {city.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-sm text-slate-600">
        Organising something?{" "}
        <a
          href={godesiUrl("/events/new")}
          target="_blank"
          rel="noopener"
          className={`font-bold ${site.accent}`}
        >
          List it free on Godesi.com
        </a>{" "}
        and it shows up here with its own short link.
      </p>
    </main>
  );
}
