import { dateLabel, place, priceLabel, type PublicEvent } from "./events";

/**
 * Copy written from the event's own fields. Search engines rank pages, not
 * databases: without this an event page would be the organiser's description
 * repeated on two domains, so every page here carries its own summary,
 * practical notes and questions answered.
 */
export function intro(event: PublicEvent) {
  const what = event.eventType ? event.eventType.toLowerCase() : "community event";
  const where = event.mode === "ONLINE" ? "online" : `in ${place(event)}`;
  const price = priceLabel(event);
  const bits = [
    `${event.title} is a desi ${what} ${where} on ${dateLabel(event.startsAt, true)}.`,
    event.mode === "ONLINE"
      ? "It runs online, so you can join from anywhere."
      : `The venue is ${[event.hallName, event.venue].filter(Boolean).join(", ")}${
          event.address ? `, ${event.address}` : ""
        }.`,
    price === "Free entry"
      ? "Entry is free, though seats are limited and organisers ask you to reserve one."
      : `Tickets start at ${price.replace("From ", "")}.`,
    event.seatsLeft && event.seatsLeft < 25
      ? `Only ${event.seatsLeft} seats are still open.`
      : null,
    event.recurrence ? `It repeats: ${event.recurrence}.` : null,
    "Booking is handled by the organiser on Godesi.com, where your ticket and QR entry pass are issued.",
  ];

  return bits.filter(Boolean).join(" ");
}

export type Faq = { question: string; answer: string };

export function faqs(event: PublicEvent): Faq[] {
  const spot = event.mode === "ONLINE" ? "online" : place(event);
  const features = event.features.map((feature) => feature.toLowerCase());
  const has = (word: string) => features.some((f) => f.includes(word));
  const price = priceLabel(event);

  const list: Faq[] = [
    {
      question: `When is ${event.title}?`,
      answer: `It starts on ${dateLabel(event.startsAt, true)}${
        event.endsAt ? ` and ends ${dateLabel(event.endsAt, true)}` : ""
      }. Doors usually open a little earlier, so plan to arrive ahead of the start time.`,
    },
    {
      question: `Where is it held?`,
      answer:
        event.mode === "ONLINE"
          ? "This is an online event; the joining link is sent with your ticket."
          : `${[event.hallName, event.venue, event.address, place(event)]
              .filter(Boolean)
              .join(", ")}. Use the map link on this page for directions.`,
    },
    {
      question: `How much are tickets and where do I buy them?`,
      answer: `${
        price === "Free entry"
          ? "Entry is free"
          : `Tickets are ${price.toLowerCase()}`
      }${
        event.tiers.length > 1
          ? ` across ${event.tiers.length} ticket types (${event.tiers
              .map((tier) => tier.name)
              .join(", ")})`
          : ""
      }. Book on the event's Godesi.com page — that is the organiser's official ticket page, and your seats are confirmed instantly.`,
    },
  ];

  if (has("family") || has("kid")) {
    list.push({
      question: "Is it suitable for children and families?",
      answer:
        "Yes — the organiser has marked this as a family-friendly event, so children are welcome.",
    });
  }

  if (has("food")) {
    list.push({
      question: "Will there be food?",
      answer:
        "Food is available at the venue. Desi community events usually run vegetarian stalls; check with the organiser for Jain, vegan or halal options.",
    });
  }

  if (has("park")) {
    list.push({
      question: "Is parking available?",
      answer: `Parking is available at or near the venue in ${spot}. Arrive early for large festivals, when nearby lots fill up fast.`,
    });
  }

  if (event.bonusNote) {
    list.push({
      question: "Is anything included with my ticket?",
      answer: event.bonusNote,
    });
  }

  list.push({
    question: `What else is happening around ${spot}?`,
    answer: `Browse more desi festivals, concerts, garba nights and workshops on the ${spot} page of this site — we list every event the community posts on Godesi.`,
  });

  return list;
}

/** A short, city-specific paragraph for a city landing page. */
export function cityIntro(city: string, state: string | null, count: number) {
  const where = [city, state].filter(Boolean).join(", ");

  return `There ${count === 1 ? "is" : "are"} ${count} upcoming desi ${
    count === 1 ? "event" : "events"
  } in ${where} — festivals and melas, garba and bhangra nights, concerts, temple programmes, kids' workshops, business meetups and community fundraisers. Each event below has its own page with the schedule, line-up, venue and directions, ticket prices and the organiser's details, and tickets are booked on Godesi.com.`;
}
