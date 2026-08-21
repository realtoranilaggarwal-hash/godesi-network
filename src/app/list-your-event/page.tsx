import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { fetchHowItWorks, money } from "@/lib/howItWorks";
import { jsonLd } from "@/lib/jsonLd";
import { eventSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 3600;

const TITLE = "List your event free — fees, tickets and where you get listed";
const DESCRIPTION =
  "Post your desi event once and it gets a page here and on Godesi.com: free unlimited listings, ticket sales with QR check-in, city and category listings, and no Godesi service fee on a paid plan.";

export function generateMetadata(): Metadata {
  const site = eventSiteForHost(headers().get("host"));

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `https://${site.domain}/list-your-event` },
    openGraph: {
      type: "article",
      title: TITLE,
      description: DESCRIPTION,
      url: `https://${site.domain}/list-your-event`,
    },
  };
}

export default async function ListYourEventPage() {
  const site = eventSiteForHost(headers().get("host"));
  const guide = await fetchHowItWorks();
  if (!guide) notFound();

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <nav className="text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:underline">
          {site.name}
        </Link>{" "}
        › <span className="text-slate-700">List your event</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          List your event free — {guide.tagline}
        </h1>
        <p className="max-w-3xl text-slate-600">
          {guide.blurb} Post it on Godesi.com and it gets a full page here on{" "}
          {site.name} too — its own listing, its own city and event-type pages,
          and its own search results — while the tickets, the money and the door
          list stay with you on Godesi.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={guide.postUrl}
            target="_blank"
            rel="noopener"
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800"
          >
            Post your event on Godesi.com
          </a>
          <Link
            href="/events"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            See what is already listed
          </Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-black">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guide.steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                Step {index + 1}
              </p>
              <p className="mt-1 font-bold text-slate-900">{step.title}</p>
              <p className="mt-1 text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">Listing plans</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {guide.plans.map((plan) => (
            <article
              key={plan.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="font-bold text-slate-900">{plan.name}</p>
              <p className="mt-1 text-2xl font-black">
                {money(plan.priceUsd, plan.priceInr)}
                {plan.priceUsd ? (
                  <span className="text-xs font-bold text-slate-500">
                    {" "}
                    / year
                  </span>
                ) : null}
              </p>
              <p className="mt-2 text-sm text-slate-600">{plan.blurb}</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {plan.note}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">Ticketing fees</h2>
        <dl className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm">
          {guide.fees.map((fee) => (
            <div
              key={fee.label}
              className="flex flex-wrap items-center justify-between gap-2 p-4"
            >
              <dt className="font-bold text-slate-900">{fee.label}</dt>
              <dd className="text-slate-600">{fee.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-slate-500">
          {site.name} never charges organisers or attendees: every payment,
          refund and entry pass is handled by Godesi.com.
        </p>
      </section>

      <AdSlot accent={site.accent} />

      <section className="space-y-3">
        <h2 className="text-xl font-black">Where your event gets published</h2>
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {guide.published.map((row) => (
            <li key={row.where} className="p-4">
              <p className="font-bold text-slate-900">{row.where}</p>
              <p className="mt-1 text-sm text-slate-600">{row.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">Want even more visibility?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {guide.ads.map((ad) => (
            <article
              key={ad.name}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="font-bold text-slate-900">{ad.name}</p>
              <p className="mt-1 text-xl font-black">
                {money(ad.priceUsd, ad.priceInr)}
                <span className="text-xs font-bold text-slate-500">
                  {" "}
                  / month
                </span>
              </p>
              <p className="mt-2 text-sm text-slate-600">{ad.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">Why organisers use Godesi</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {guide.reasons.map((reason) => (
            <li
              key={reason}
              className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">The whole thing on one page</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.posterUrl}
          alt={`How events work on Godesi: create the event, get listed, sell tickets, reach more people and grow — with listing plans from ${money(
            guide.plans[1].priceUsd,
            guide.plans[1].priceInr,
          )} a year, ticketing fees and where your event gets published`}
          width={1024}
          height={1536}
          loading="lazy"
          className="w-full rounded-3xl border border-slate-200"
        />
        <a
          href={guide.posterShareUrl}
          target="_blank"
          rel="noopener"
          className={`text-sm font-bold ${site.accent}`}
        >
          Download this to share in your WhatsApp groups →
        </a>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-black">Ready to post your event?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Posting takes about two minutes and costs nothing. Your event page
          appears here on {site.name} by itself, and every ticket button on it
          sends buyers to your Godesi listing.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
          <a
            href={guide.postUrl}
            target="_blank"
            rel="noopener"
            className={site.accent}
          >
            Post your event free →
          </a>
          <a
            href={guide.guideUrl}
            target="_blank"
            rel="noopener"
            className={site.accent}
          >
            Read the full organiser guide on Godesi.com →
          </a>
          <a
            href={godesiUrl("/contact")}
            target="_blank"
            rel="noopener"
            className={site.accent}
          >
            Ask a question →
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(schema(guide, site.domain, site.name)),
        }}
      />
    </main>
  );
}

/** HowTo plus FAQ markup, so the posting steps and the fees can show in search. */
function schema(
  guide: NonNullable<Awaited<ReturnType<typeof fetchHowItWorks>>>,
  domain: string,
  siteName: string,
) {
  const url = `https://${domain}/list-your-event`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: "List your desi event and sell tickets",
        description: DESCRIPTION,
        url,
        publisher: { "@type": "Organization", name: siteName },
        step: guide.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.body,
          url: `${url}#step-${index + 1}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What does it cost to list an event?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Nothing. Listings are free and unlimited on every plan, and a free-entry event costs nothing at all. Paid plans (${guide.plans
                .filter((plan) => plan.priceUsd)
                .map((plan) => `${plan.name} ${money(plan.priceUsd, plan.priceInr)} a year`)
                .join(", ")}) add visibility and remove the ticket service fee.`,
            },
          },
          ...guide.fees.map((fee) => ({
            "@type": "Question",
            name: `${fee.label} — what is the fee?`,
            acceptedAnswer: { "@type": "Answer", text: fee.value },
          })),
          {
            "@type": "Question",
            name: `Where does my event appear besides ${siteName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: guide.published
                .map((row) => `${row.where}: ${row.body}`)
                .join(" "),
            },
          },
          {
            "@type": "Question",
            name: `Do I sell tickets on ${siteName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `No. ${siteName} publishes the event page and sends buyers to your Godesi.com listing, where payment, seat counts, QR tickets and door check-ins are handled.`,
            },
          },
        ],
      },
    ],
  };
}
