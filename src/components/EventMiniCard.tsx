import Link from "next/link";
import {
  dayChip,
  eventPath,
  picture,
  place,
  priceLabel,
  type PublicEvent,
} from "@/lib/events";

/** A small, scannable event tile for search-first event sites. */
export function EventMiniCard({ event }: { event: PublicEvent }) {
  const image = picture(event.imageUrl);

  return (
    <Link
      href={eventPath(event)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={event.title}
            loading="lazy"
            className="h-28 w-full object-cover"
          />
        ) : (
          <div className="flex h-28 items-center justify-center bg-gradient-to-br from-fuchsia-600 to-amber-500 text-3xl">
            <span aria-hidden>🎉</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-black uppercase text-slate-900 shadow">
          {dayChip(event.startsAt)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 text-sm font-black leading-snug text-slate-900 group-hover:underline">
          {event.title}
        </h3>
        <p className="truncate text-xs text-slate-500">
          {event.mode === "ONLINE" ? "Online" : place(event)}
        </p>
        <p className="mt-auto text-xs font-black text-slate-800">
          {event.soldOut ? "Sold out" : priceLabel(event)}
        </p>
      </div>
    </Link>
  );
}
