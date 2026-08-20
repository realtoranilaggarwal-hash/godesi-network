import { headers } from "next/headers";
import { AdSlot } from "@/components/AdSlot";
import { FeedSection } from "@/components/FeedSection";
import { SiteSearch } from "@/components/SiteSearch";
import { DJ_SIGNUP, godesiUrl, siteForHost } from "@/lib/sites";

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
  itplacement: {
    href: "/leads/new",
    label: "📣 Post an IT requirement free",
    note: "Employers and consultancies post roles; candidates respond free",
  },
  desiwhoswho: {
    href: "/desi-elite/apply",
    label: "🏆 Nominate someone, or apply yourself",
    note: "Free · our desk verifies every entry before it is published",
  },
  djswiki: {
    href: DJ_SIGNUP,
    label: "🎧 Get your free DJs.wiki listing",
    note: "Free for the first year · list once on Godesi and your profile appears here",
  },
  godesiwiki: {
    href: "/signup?next=%2Fdashboard%2Fprofile%3Ftype%3Dbusiness",
    label: "🌐 Get your free GoDesi.wiki listing",
    note: "Free for the first year · list once on Godesi.com and your page appears here",
  },
  itplacementservices: {
    href: "/signup",
    label: "🏢 List your consultancy free",
    note: "Free claimable page with hotlist, contacts, WhatsApp and photos",
  },
};

export default function HomePage() {
  const site = siteForHost(headers().get("host"));
  const cta = CTA[site.key] ?? {
    href: "/signup",
    label: "Post on Godesi",
    note: "Free · listings, events and requirements",
  };

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
        {site.search ? (
          <SiteSearch
            placeholder={site.search.placeholder}
            suggestions={site.search.suggestions}
          />
        ) : null}
      </section>

      {site.key === "djswiki" ? (
        <section className="rounded-3xl border-2 border-fuchsia-300 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-fuchsia-700">
            Free for 1 year
          </p>
          <h2 className="mt-1 text-2xl font-black">
            Every DJ listed on Godesi.com is published here — free
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Add your card in the DJs &amp; sound section of Godesi.com — your
            services, music languages, equipment and rig, packages, event types,
            performance area, years of experience, videos and photos — and the
            same profile appears on DJs.wiki. One form, two directories, no fee
            for the first year, and enquiries come straight to you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={godesiUrl(DJ_SIGNUP)}
              target="_blank"
              rel="noopener"
              className="rounded-xl bg-fuchsia-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-fuchsia-800"
            >
              List your DJ service free
            </a>
            <a
              href={godesiUrl("/categories/events-wedding-dj-and-sound")}
              target="_blank"
              rel="noopener"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              See the DJ section on Godesi
            </a>
          </div>
        </section>
      ) : null}

      {site.key === "godesiwiki" ? (
        <section className="rounded-3xl border-2 border-amber-300 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">
            Free for 1 year
          </p>
          <h2 className="mt-1 text-2xl font-black">
            Everything you list on Godesi.com is published here — free
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Fill in one card on Godesi.com — your categories, services and
            products, languages, service areas, working hours, price range,
            special offers, photos and videos — and the same page appears on
            GoDesi.wiki. One profile, two platforms, no fee for the first year.
            The marketing and search optimisation are on us, and enquiries come
            straight to you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={godesiUrl(cta.href)}
              target="_blank"
              rel="noopener"
              className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
            >
              List your business free
            </a>
            <a
              href={godesiUrl("/categories")}
              target="_blank"
              rel="noopener"
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Browse every category on Godesi
            </a>
          </div>
          {/* The offer poster, shown whole so the small print stays readable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={godesiUrl("/godesi-marketing.jpg")}
            alt="Free marketing, free SEO and a free GoDesi.wiki membership with a Godesi.com listing"
            loading="lazy"
            className="mt-5 w-full rounded-2xl border border-amber-200"
          />
        </section>
      ) : null}

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
