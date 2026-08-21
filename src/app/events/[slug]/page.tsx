import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { EventGrid } from "@/components/EventGrid";
import { ShareRow } from "@/components/ShareRow";
import { faqs, intro } from "@/lib/eventCopy";
import {
  cityPath,
  dateLabel,
  fetchEvent,
  fetchEvents,
  hasEnded,
  picture,
  place,
  priceLabel,
  typePath,
  type PublicEvent,
} from "@/lib/events";
import { jsonLd } from "@/lib/jsonLd";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const site = eventSiteForHost(headers().get("host"));
  const event = await fetchEvent(params.slug);
  if (!event) return { title: "Event not found", robots: { index: false } };

  const title = `${event.title} — ${dateLabel(event.startsAt)}, ${place(event)}`;
  const description = `${event.title}: ${dateLabel(event.startsAt, true)} at ${
    event.venue
  }, ${place(event)}. ${priceLabel(event)}. Line-up, schedule, directions and tickets.`;
  const image = picture(event.imageUrl);

  return {
    title,
    description,
    robots: hasEnded(event) ? { index: false } : undefined,
    // Self-referencing: this page is the canonical version of itself, which is
    // what lets Eventringer rank instead of only feeding godesi.com.
    alternates: { canonical: `https://${site.domain}/events/${event.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://${site.domain}/events/${event.slug}`,
      images: image ? [image] : undefined,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const site = eventSiteForHost(headers().get("host"));
  const event = await fetchEvent(params.slug);
  if (!event) notFound();

  const image = picture(event.imageUrl);
  const over = hasEnded(event);
  const questions = faqs(event);
  const [nearby, sameType] = await Promise.all([
    fetchEvents({ city: event.city, limit: "7" }),
    event.eventType
      ? fetchEvents({ type: event.eventType, limit: "7" })
      : Promise.resolve({ items: [] as PublicEvent[], total: 0 }),
  ]);
  const others = dedupe(
    [...nearby.items, ...sameType.items].filter(
      (item) => item.slug !== event.slug,
    ),
  ).slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <nav className="text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:underline">
          {site.name}
        </Link>{" "}
        ›{" "}
        <Link href="/events" className="hover:underline">
          Events
        </Link>{" "}
        ›{" "}
        {over ? (
          <span>{place(event)}</span>
        ) : (
          <Link href={cityPath(event.city)} className="hover:underline">
            {place(event)}
          </Link>
        )}{" "}
        › <span className="text-slate-700">{event.title}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          {event.title}
        </h1>
        <p className="text-sm font-bold text-slate-600">
          {dateLabel(event.startsAt, true)} ·{" "}
          {event.mode === "ONLINE" ? "Online" : place(event)} ·{" "}
          {priceLabel(event)}
        </p>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={event.title}
            className="w-full rounded-3xl object-cover"
          />
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={over ? godesiUrl("/events") : event.ticketUrl}
            target="_blank"
            rel="noopener"
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800"
          >
            {over
              ? "See upcoming events on Godesi.com"
              : event.soldOut
                ? "Sold out — check for returns on Godesi"
                : priceLabel(event) === "Free entry"
                  ? "Reserve a free seat on Godesi.com"
                  : "Get tickets on Godesi.com"}
          </a>
          {!over && event.mapsUrl ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener nofollow"
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              📍 Directions
            </a>
          ) : null}
        </div>
        {over ? (
          <p className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">
            This event is over. Tickets are no longer available — browse
            what&apos;s coming up next on {site.name}.
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Tickets are sold by the organiser on Godesi.com. Eventringer lists
            the event; payment, seats and entry passes are handled there.
          </p>
        )}
        <ShareRow
          url={`https://${site.domain}/events/${event.slug}`}
          title={event.title}
          image={image}
        />
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-black">In short</h2>
        <p className="mt-2 text-slate-700">{intro(event)}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Fact label="Starts">{dateLabel(event.startsAt, true)}</Fact>
          {event.endsAt ? (
            <Fact label="Ends">{dateLabel(event.endsAt, true)}</Fact>
          ) : null}
          <Fact label="Venue">
            {[event.hallName, event.venue, event.address, place(event)]
              .filter(Boolean)
              .join(", ")}
          </Fact>
          <Fact label="Tickets">{priceLabel(event)}</Fact>
          {event.eventType ? (
            <Fact label="Type">
              <Link href={typePath(event.eventType)} className="underline">
                {event.eventType}
              </Link>
            </Fact>
          ) : null}
          {event.organizer ? (
            <Fact label="Organiser">
              {event.organizerUrl ? (
                <a
                  href={event.organizerUrl}
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  {event.organizer}
                </a>
              ) : (
                event.organizer
              )}
            </Fact>
          ) : null}
        </dl>
        {event.features.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {event.features.map((feature) => (
              <li
                key={feature}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
              >
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">About this event</h2>
        <p className="whitespace-pre-line text-slate-700">
          {event.description}
        </p>
        {event.bonusNote ? (
          <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">
            🎁 {event.bonusNote}
          </p>
        ) : null}
      </section>

      <AdSlot accent={site.accent} />

      {event.tiers.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-black">Ticket options</h2>
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {event.tiers.map((tier) => (
              <li
                key={tier.name}
                className="flex items-center justify-between gap-3 p-4 text-sm"
              >
                <span className="font-bold">{tier.name}</span>
                <span className="text-slate-600">
                  {tier.price
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: event.currency || "USD",
                        maximumFractionDigits: 0,
                      }).format(tier.price)
                    : "Free"}{" "}
                  · {tier.seatsLeft} left
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.sessions.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-black">Schedule</h2>
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {event.sessions.map((session) => (
              <li key={`${session.title}-${session.startTime}`} className="p-4">
                <p className="font-bold text-slate-900">{session.title}</p>
                <p className="text-xs font-semibold text-slate-500">
                  {[
                    [session.startTime, session.endTime]
                      .filter(Boolean)
                      .join(" – "),
                    session.stage,
                    session.speaker,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {event.speakers.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-black">Line-up</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.speakers.map((speaker) => {
              const photo = picture(speaker.photoUrl);
              return (
                <article
                  key={speaker.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={speaker.name}
                      loading="lazy"
                      className="mb-3 h-32 w-full rounded-xl object-contain"
                    />
                  ) : null}
                  <p className="font-bold">{speaker.name}</p>
                  {speaker.bio ? (
                    <p className="mt-1 text-sm text-slate-600">{speaker.bio}</p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {event.videoUrl ? (
        <section className="space-y-3">
          <h2 className="text-xl font-black">Promo video</h2>
          <a
            href={event.videoUrl}
            target="_blank"
            rel="noopener nofollow"
            className={`text-sm font-bold ${site.accent}`}
          >
            Watch the event video →
          </a>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-xl font-black">Questions people ask</h2>
        <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {questions.map((faq) => (
            <div key={faq.question} className="p-4">
              <h3 className="font-bold text-slate-900">{faq.question}</h3>
              <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">
          More desi events in {place(event)}
        </h2>
        <EventGrid events={others} accent={site.accent} />
        {/* The hubs are built from the upcoming-event facets, so a city or type
            with nothing coming up has no page to link to. */}
        <div className="flex flex-wrap gap-3 text-sm font-bold">
          {nearby.total ? (
            <Link href={cityPath(event.city)} className={site.accent}>
              All events in {event.city} →
            </Link>
          ) : null}
          {event.eventType && sameType.total ? (
            <Link href={typePath(event.eventType)} className={site.accent}>
              All {event.eventType.toLowerCase()} events →
            </Link>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-black">Organising an event?</h2>
        <p className="mt-2 text-sm text-slate-600">
          List it free on Godesi.com — sell tickets, collect enquiries and it
          gets a page like this one on {site.name} automatically.
        </p>
        <Link
          href="/list-your-event"
          className={`mt-3 inline-block text-sm font-bold ${site.accent}`}
        >
          See the fees and list your event free →
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(eventSchema(event, site.domain, site.name, questions)),
        }}
      />
    </main>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="text-slate-800">{children}</dd>
    </div>
  );
}

function dedupe(events: PublicEvent[]) {
  const seen = new Set<string>();
  return events.filter((event) => {
    if (seen.has(event.slug)) return false;
    seen.add(event.slug);
    return true;
  });
}

/**
 * Event and FAQ markup, which is what earns the rich result (date, venue and
 * price in the search listing) that makes this page worth hosting here.
 */
function eventSchema(
  event: PublicEvent,
  domain: string,
  siteName: string,
  questions: { question: string; answer: string }[],
) {
  const url = `https://${domain}/events/${event.slug}`;
  const cheapest = event.tiers.length
    ? Math.min(...event.tiers.map((tier) => tier.price))
    : event.price;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: event.title,
        description: event.description.slice(0, 4000),
        startDate: event.startsAt,
        endDate: event.endsAt ?? undefined,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          event.mode === "ONLINE"
            ? "https://schema.org/OnlineEventAttendanceMode"
            : event.mode === "HYBRID"
              ? "https://schema.org/MixedEventAttendanceMode"
              : "https://schema.org/OfflineEventAttendanceMode",
        image: event.imageUrl ? [event.imageUrl] : undefined,
        url,
        location:
          event.mode === "ONLINE"
            ? {
                "@type": "VirtualLocation",
                url: event.onlineUrl ?? event.ticketUrl,
              }
            : {
                "@type": "Place",
                name: [event.hallName, event.venue].filter(Boolean).join(", "),
                address: {
                  "@type": "PostalAddress",
                  streetAddress: event.address ?? undefined,
                  addressLocality: event.city,
                  addressRegion: event.state ?? undefined,
                  addressCountry: event.country ?? undefined,
                },
              },
        organizer: event.organizer
          ? {
              "@type": "Organization",
              name: event.organizer,
              url: event.organizerUrl ?? event.ticketUrl,
            }
          : undefined,
        performer: event.speakers.length
          ? event.speakers.map((speaker) => ({
              "@type": "Person",
              name: speaker.name,
            }))
          : undefined,
        // A finished event keeps its markup, minus the bookable offer.
        offers: hasEnded(event)
          ? undefined
          : {
              "@type": "Offer",
              price: cheapest,
              priceCurrency: event.currency || "USD",
              availability: event.soldOut
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
              url: event.ticketUrl,
              validFrom: event.createdAt,
            },
        isAccessibleForFree: cheapest === 0,
        publisher: { "@type": "Organization", name: siteName },
      },
      {
        "@type": "FAQPage",
        mainEntity: questions.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Events",
            item: `https://${domain}/events`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: place(event),
            item: `https://${domain}${cityPath(event.city)}`,
          },
          { "@type": "ListItem", position: 3, name: event.title, item: url },
        ],
      },
    ],
  };
}
