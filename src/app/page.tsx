import { headers } from "next/headers";
import { AdSlot } from "@/components/AdSlot";
import { FeedSection } from "@/components/FeedSection";
import { godesiUrl, siteForHost } from "@/lib/sites";

export const revalidate = 600;

const CTA: Record<string, { href: string; label: string; note: string }> = {
  desinewspaper: {
    href: "/news/report",
    label: "📣 Report news from your city",
    note: "Free · takes two minutes · your name on the byline",
  },
  diwali: {
    href: "/events/new",
    label: "🎟️ List your festival event",
    note: "Free listing · photos, tickets and WhatsApp enquiries",
  },
  iba: {
    href: "/signup",
    label: "🏪 List your business free",
    note: "Free page with photos, reviews, WhatsApp and a QR card",
  },
};

export default function HomePage() {
  const site = siteForHost(headers().get("host"));
  const cta = CTA[site.key];

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <section className={`rounded-3xl bg-gradient-to-r ${site.gradient} px-5 py-10 text-white sm:px-8`}>
        <h1 className="text-3xl font-black sm:text-4xl">{site.tagline}</h1>
        <p className="mt-2 max-w-2xl text-white/90">{site.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={godesiUrl(cta.href)}
            target="_blank"
            rel="noopener"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100"
          >
            {cta.label}
          </a>
          <a
            href={godesiUrl()}
            target="_blank"
            rel="noopener"
            className="rounded-xl border border-white/50 px-4 py-2.5 text-sm font-bold hover:bg-white/15"
          >
            Explore Godesi.com
          </a>
        </div>
        <p className="mt-2 text-xs text-white/80">{cta.note}</p>
      </section>

      {site.sections.map((section, index) => (
        <div key={section.heading} className="space-y-8">
          <FeedSection site={site} section={section} />
          {index === 0 ? <AdSlot accent={site.accent} /> : null}
        </div>
      ))}

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-black">Powered by Godesi</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Everything on {site.name} lives on Godesi — a free desi directory and
          community marketplace with business listings, buyer requirements,
          events with tickets, community news, live desi radio and TV.
        </p>
        <a
          href={godesiUrl()}
          target="_blank"
          rel="noopener"
          className={`mt-3 inline-block text-sm font-bold ${site.accent}`}
        >
          Visit Godesi.com →
        </a>
      </section>
    </main>
  );
}
