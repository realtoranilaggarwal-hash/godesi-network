import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { picture } from "@/components/FeedCard";
import { fetchCard } from "@/lib/cards";
import { cardSiteForHost, godesiUrl } from "@/lib/sites";

export const revalidate = 600;

function wa(number: string) {
  return `https://wa.me/${number.replace(/[^\d]/g, "")}`;
}

function money(card: { priceFrom: number | null; priceCurrency: string | null }) {
  if (!card.priceFrom) return null;
  return `from $${card.priceFrom}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const site = cardSiteForHost(headers().get("host"));
  const card = await fetchCard(params.slug);
  if (!card) return { title: site.name };
  const place = [card.city, card.state].filter(Boolean).join(", ");
  return {
    title: `${card.name}${place ? ` — ${place}` : ""}`,
    description:
      card.description?.slice(0, 160) ??
      `${card.name} on GoDesi — services, contact and WhatsApp.`,
    openGraph: {
      title: `${card.name} — ${site.name}`,
      description: card.description?.slice(0, 160) ?? undefined,
      images: card.coverUrl || card.logoUrl ? [picture(card.coverUrl ?? card.logoUrl)!] : undefined,
    },
  };
}

export default async function CardPage({
  params,
}: {
  params: { slug: string };
}) {
  const site = cardSiteForHost(headers().get("host"));
  const card = await fetchCard(params.slug);
  if (!card) notFound();

  const place = [card.city, card.state, card.country]
    .filter(Boolean)
    .join(", ");
  const image = picture(card.logoUrl ?? card.coverUrl);
  const qrSrc = `/api/cardqr/${encodeURIComponent(card.slug)}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className={`bg-gradient-to-r ${site.gradient} px-6 py-5`}>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
            {site.name} · {card.shortUrl}
          </p>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:flex-row">
          <div className="shrink-0">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={card.name}
                className="h-28 w-28 rounded-2xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-4xl">
                {site.emoji}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black text-slate-900">
              {card.name}
              {card.verified ? (
                <span className="ml-2 align-middle text-sm font-bold text-emerald-600">
                  ✓ Verified
                </span>
              ) : null}
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {[card.subcategory ?? card.categorySlug, place]
                .filter(Boolean)
                .join(" · ")}
              {card.yearsExperience ? ` · ${card.yearsExperience} yrs` : ""}
              {money(card) ? ` · ${money(card)}` : ""}
            </p>
            {card.description ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {card.description.slice(0, 300)}
                {card.description.length > 300 ? "…" : ""}
              </p>
            ) : null}
            {card.services.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {card.services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-900"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 p-6 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-2">
            {card.phone ? (
              <a
                href={`tel:${card.phone}`}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
              >
                📞 Call
              </a>
            ) : null}
            {card.whatsapp ? (
              <a
                href={wa(card.whatsapp)}
                target="_blank"
                rel="noopener"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                💬 WhatsApp
              </a>
            ) : null}
            {card.websiteUrl ? (
              <a
                href={card.websiteUrl}
                target="_blank"
                rel="noopener"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                🌐 Website
              </a>
            ) : null}
            {card.email ? (
              <a
                href={`mailto:${card.email}`}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                ✉️ Email
              </a>
            ) : null}
            {card.mapsUrl ? (
              <a
                href={card.mapsUrl}
                target="_blank"
                rel="noopener"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                📍 Directions
              </a>
            ) : null}
          </div>
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt={`QR for ${card.shortUrl}`}
              width={120}
              height={120}
              className="rounded-xl border border-slate-200"
            />
            <p className="mt-1 text-[11px] font-bold text-slate-500">
              Scan → {card.shortUrl}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <a
              href={card.url}
              target="_blank"
              rel="noopener"
              className={`text-sm font-black ${site.accent}`}
            >
              Full profile, reviews &amp; photos on GoDesi →
            </a>
            {!card.claimed ? (
              <p className="mt-1 text-xs text-slate-500">
                Unclaimed card —{" "}
                <a
                  href={godesiUrl("/claim")}
                  target="_blank"
                  rel="noopener"
                  className="font-bold underline"
                >
                  is this you? Claim it free
                </a>
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Get your own free card →
          </Link>
        </div>
      </article>
    </main>
  );
}
