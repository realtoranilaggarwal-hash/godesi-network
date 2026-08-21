import Link from "next/link";
import { fetchEvents, type PublicEvent } from "@/lib/events";
import { godesiUrl, type EventRow, type SiteConfig } from "@/lib/sites";
import { EventCard } from "./EventCard";

export function EventGrid({
  events,
  accent,
}: {
  events: PublicEvent[];
  accent: string;
}) {
  if (!events.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Nothing listed here yet.{" "}
        <a
          href={godesiUrl("/events/new")}
          target="_blank"
          rel="noopener"
          className={`font-bold ${accent}`}
        >
          List your event free
        </a>{" "}
        and it will show up on this page.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.slug} event={event} accent={accent} />
      ))}
    </div>
  );
}

/** One home-page row, rendered from Godesi's event API. */
export async function EventRowSection({
  site,
  row,
}: {
  site: SiteConfig;
  row: EventRow;
}) {
  const { items } = await fetchEvents(row.query);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900">{row.heading}</h2>
          <p className="text-sm text-slate-600">{row.blurb}</p>
        </div>
        {row.moreHref ? (
          <Link
            href={row.moreHref}
            className={`text-sm font-bold ${site.accent}`}
          >
            {row.moreLabel ?? "See all"} →
          </Link>
        ) : null}
      </div>
      <EventGrid events={items} accent={site.accent} />
    </section>
  );
}
