import Link from "next/link";
import { godesiUrl } from "@/lib/sites";

/**
 * The organiser pitch, in the one place every event surface can reuse. Numbers
 * live on /list-your-event, which reads them from Godesi — so nothing here can
 * go stale when a plan or fee changes.
 */
const ADVANTAGES = [
  {
    emoji: "🆓",
    title: "Free, unlimited listings",
    body: "Post as many events as you run on the free plan — no per-event charge, no listing limit and no contract.",
  },
  {
    emoji: "🎟️",
    title: "Real ticketing, not a form",
    body: "Sell paid or free tickets with multiple tiers, seat counts and sold-out handling, all on Godesi.com.",
  },
  {
    emoji: "📱",
    title: "QR tickets and door check-in",
    body: "Every buyer gets a QR ticket and you scan people in at the door — no spreadsheets on the night.",
  },
  {
    emoji: "🔎",
    title: "Two audiences, one form",
    body: "Your event goes live in the Godesi.com directory and gets its own full page here on Eventringer.",
  },
  {
    emoji: "📈",
    title: "Search traffic that keeps working",
    body: "City, event-type and venue pages here are indexable, so people searching months later still find you.",
  },
  {
    emoji: "🏛️",
    title: "Your venue gets a page",
    body: "Name the hall and it gets its own venue page listing everything coming up there — useful long after your event.",
  },
  {
    emoji: "💸",
    title: "Keep more per ticket",
    body: "Free plan takes a small service fee on paid tickets; paid plans drop it to zero and free entry is always free.",
  },
  {
    emoji: "🎛️",
    title: "You stay in control",
    body: "Edit the line-up, photos, prices and seats any time on Godesi; every page here updates on its own.",
  },
] as const;

export function WhyGodesi({
  accent,
  siteName,
}: {
  accent: string;
  siteName: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        For organisers
      </p>
      <h2 className="mt-1 text-2xl font-black">
        Why post your event on Godesi.com
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Post it once on Godesi.com and it is listed there, published as a full
        page here on {siteName}, and ticketed with QR check-in — free to start.
      </p>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADVANTAGES.map((advantage) => (
          <li
            key={advantage.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <span className="text-2xl" aria-hidden>
              {advantage.emoji}
            </span>
            <h3 className="mt-2 text-sm font-black text-slate-900">
              {advantage.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{advantage.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={godesiUrl("/events/new")}
          target="_blank"
          rel="noopener"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
        >
          Post your event free
        </a>
        <Link
          href="/list-your-event"
          className={`rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold ${accent} hover:bg-slate-50`}
        >
          See plans, fees and where you get listed
        </Link>
      </div>
    </section>
  );
}
