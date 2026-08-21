import Link from "next/link";
import {
  dateLabel,
  eventPath,
  picture,
  place,
  priceLabel,
  type PublicEvent,
} from "@/lib/events";

/**
 * An event teaser that links to this site's own event page — the whole point of
 * an event site with SEO value of its own.
 */
export function EventCard({
  event,
  accent,
}: {
  event: PublicEvent;
  accent: string;
}) {
  const image = picture(event.imageUrl);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={eventPath(event)} className="block">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={event.title}
            loading="lazy"
            className="h-40 w-full object-cover"
          />
        ) : (
          <div className="flex h-24 items-center justify-center bg-slate-100 text-3xl">
            🎟️
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={eventPath(event)} className="min-w-0">
          <h3 className="font-bold leading-snug text-slate-900 group-hover:underline">
            {event.title}
          </h3>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {dateLabel(event.startsAt)} · {priceLabel(event)}
          </p>
          <p className="mt-1 line-clamp-3 text-sm text-slate-600">
            {event.description}
          </p>
        </Link>
        <p className="mt-auto pt-3 text-xs font-semibold text-slate-500">
          {[event.venue, place(event), event.eventType]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <Link
          href={eventPath(event)}
          className={`mt-2 text-xs font-bold ${accent}`}
        >
          Event details, line-up &amp; tickets →
        </Link>
      </div>
    </article>
  );
}
