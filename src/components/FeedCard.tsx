import { FeedItem, isEvent, isNews } from "@/lib/feed";

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
  const title = isNews(item) || isEvent(item) ? item.title : item.name;
  const image = isNews(item) || isEvent(item) ? item.imageUrl : item.logoUrl;

  const meta = isNews(item)
    ? [dateLabel(item.publishedAt), place(item.city, item.state), item.source]
    : isEvent(item)
      ? [dateLabel(item.startsAt), item.venue, place(item.city, item.state)]
      : [place(item.city, item.state), item.subcategory ?? item.categorySlug];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold leading-snug text-slate-900 group-hover:underline">
          {title}
        </h3>
        <p className="mt-1 line-clamp-3 text-sm text-slate-600">{item.teaser}</p>
        <p className="mt-auto pt-3 text-xs font-semibold text-slate-500">
          {meta.filter(Boolean).join(" · ")}
        </p>
        <span className={`mt-2 text-xs font-bold ${accent}`}>
          Read on Godesi →
        </span>
      </div>
    </a>
  );
}
