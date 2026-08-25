import Link from "next/link";
import {
  dayChip,
  eventPath,
  picture,
  place,
  priceLabel,
  timeChip,
  venuePath,
  whenBadge,
  type PublicEvent,
} from "@/lib/events";

/** Festival posters are the draw; without one the card still has to look alive. */
const GRADIENTS = [
  "from-violet-600 to-fuchsia-500",
  "from-orange-500 to-rose-500",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-amber-500 to-red-500",
];

const EMOJI: Record<string, string> = {
  festival: "🪔",
  mela: "🎡",
  garba: "💃",
  navratri: "💃",
  concert: "🎤",
  music: "🎧",
  dj: "🎧",
  party: "🥳",
  puja: "🛕",
  temple: "🛕",
  religious: "🛕",
  conference: "🎯",
  workshop: "🛠️",
  seminar: "🎓",
  talk: "🎓",
  meetup: "🤝",
  networking: "🤝",
  kids: "🧒",
  food: "🍛",
  sport: "🏏",
  dance: "💃",
  film: "🎬",
  comedy: "🎭",
};

function flavour(event: PublicEvent) {
  const haystack = [event.eventType, ...event.tags, event.title]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const hit = Object.keys(EMOJI).find((word) => haystack.includes(word));
  const seed = event.slug
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return {
    emoji: hit ? EMOJI[hit] : "🎟️",
    gradient: GRADIENTS[seed % GRADIENTS.length],
  };
}

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
  const { emoji, gradient } = flavour(event);
  const soon = whenBadge(event.startsAt);
  const free = priceLabel(event) === "Free entry";
  const scarce = !event.soldOut && event.seatsLeft > 0 && event.seatsLeft < 25;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <Link href={eventPath(event)} className="relative block">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={event.title}
            loading="lazy"
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-44 items-center justify-center bg-gradient-to-br ${gradient} text-5xl`}
          >
            <span aria-hidden>{emoji}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-3 top-3 rounded-xl bg-white/95 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-900 shadow">
          {dayChip(event.startsAt)}
        </span>
        <span className="absolute bottom-3 left-3 text-xs font-bold text-white drop-shadow">
          {timeChip(event.startsAt)} · {place(event)}
        </span>
        <span className="absolute right-3 top-3 flex flex-col items-end gap-1">
          {event.soldOut ? (
            <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-black uppercase text-white">
              Sold out
            </span>
          ) : (
            <span
              className={`rounded-lg px-2 py-1 text-[11px] font-black uppercase ${
                free ? "bg-emerald-600 text-white" : "bg-white/95 text-slate-900"
              }`}
            >
              {priceLabel(event)}
            </span>
          )}
          {soon ? (
            <span className="rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-black uppercase text-white">
              {soon}
            </span>
          ) : null}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <span aria-hidden>{emoji}</span>
          {event.eventType ? <span>{event.eventType}</span> : null}
          {event.mode === "ONLINE" ? <span>· Online</span> : null}
          {scarce ? (
            <span className="text-rose-600">· {event.seatsLeft} seats left</span>
          ) : null}
        </div>

        <Link href={eventPath(event)} className="min-w-0">
          <h3 className="text-base font-black leading-snug text-slate-900 group-hover:underline">
            {event.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-sm text-slate-600">
            {event.description}
          </p>
        </Link>

        <p className="mt-auto pt-2 text-xs font-semibold text-slate-500">
          📍{" "}
          {event.venue && event.mode !== "ONLINE" ? (
            <Link href={venuePath(event)} className="hover:underline">
              {event.venue}
            </Link>
          ) : (
            event.venue || "Online"
          )}
          {event.venue ? `, ${place(event)}` : null}
        </p>
        <Link
          href={eventPath(event)}
          className={`text-xs font-black ${accent}`}
        >
          Line-up, seats &amp; tickets →
        </Link>
      </div>
    </article>
  );
}
