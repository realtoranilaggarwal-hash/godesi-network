import {
  FeedItem,
  isBusiness,
  isElite,
  isEvent,
  isLead,
  isNews,
} from "@/lib/feed";
import { ShareRow } from "@/components/ShareRow";
import { godesiUrl } from "@/lib/sites";

/** Publishers that refuse hot-linking still render through Godesi's proxy. */
function picture(url: string | null) {
  if (!url) return null;
  return url.includes(".public.blob.vercel-storage.com")
    ? url
    : godesiUrl(`/api/img?u=${encodeURIComponent(url)}`);
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function place(city?: string | null, state?: string | null) {
  return [city, state].filter(Boolean).join(", ");
}

/** One teaser card. The whole card links to the full record on Godesi. */
export function FeedCard({ item, accent }: { item: FeedItem; accent: string }) {
  const title = isNews(item) || isEvent(item) || isLead(item)
    ? item.title
    : item.name;
  const unclaimed = isElite(item) && !item.claimed;
  const image = isLead(item)
    ? null
    : picture(
        isNews(item) || isEvent(item) || isElite(item)
          ? item.imageUrl
          : item.logoUrl,
      );

  const services = isBusiness(item) ? (item.services ?? []) : [];

  const meta = isNews(item)
    ? [dateLabel(item.publishedAt), place(item.city, item.state), item.source]
    : isEvent(item)
      ? [dateLabel(item.startsAt), item.venue, place(item.city, item.state)]
      : isLead(item)
        ? [dateLabel(item.postedAt), item.city, item.category]
        : isElite(item)
          ? [item.org, item.category, place(item.city, item.state)]
          : [place(item.city, item.state), item.subcategory ?? item.categorySlug];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <a href={item.url} target="_blank" rel="noopener">
        {image ? (
          // A portrait cropped to fill loses the face, so people are shown whole
          // on a plain backdrop while news and event artwork still fills the card.
          <span
            className={
              isElite(item)
                ? "flex h-48 items-center justify-center bg-slate-100"
                : "block"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              loading="lazy"
              data-pin-media={image}
              data-pin-description={title}
              className={
                isElite(item)
                  ? "max-h-48 w-full object-contain"
                  : "h-40 w-full object-cover"
              }
            />
          </span>
        ) : null}
      </a>
      <div className="flex flex-1 flex-col p-4">
        <a href={item.url} target="_blank" rel="noopener" className="min-w-0">
          <h3 className="font-bold leading-snug text-slate-900 group-hover:underline">
            {title}
          </h3>
          <p className="mt-1 line-clamp-3 text-sm text-slate-600">
            {item.teaser}
          </p>
        </a>
        {services.length ? (
          <ul className="mt-2 flex flex-wrap gap-1">
            {services.slice(0, 5).map((service) => (
              <li
                key={service}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
              >
                {service}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-auto pt-3 text-xs font-semibold text-slate-500">
          {meta.filter(Boolean).join(" · ")}
        </p>
        {isElite(item) && item.imageCredit ? (
          <p className="pt-1 text-[10px] leading-tight text-slate-400">
            {item.imageCredit}
          </p>
        ) : null}
        {unclaimed ? (
          <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900">
            Unclaimed profile — written from public record
          </p>
        ) : null}
        <a
          href={isElite(item) && unclaimed ? item.claimUrl : item.url}
          target="_blank"
          rel="noopener"
          className={`mt-2 text-xs font-bold ${accent}`}
        >
          {isLead(item)
            ? "Respond on Godesi →"
            : unclaimed
              ? "View and claim on Godesi →"
              : isElite(item)
                ? "Full profile on Godesi →"
                : "Read on Godesi →"}
        </a>
        <ShareRow url={item.url} title={title} image={image} />
      </div>
    </article>
  );
}
