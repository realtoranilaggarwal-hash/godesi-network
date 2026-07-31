import { fetchFeed } from "@/lib/feed";
import { godesiUrl, type Section, type SiteConfig } from "@/lib/sites";
import { FeedCard } from "./FeedCard";

export async function FeedSection({
  site,
  section,
}: {
  site: SiteConfig;
  section: Section;
}) {
  const items = await fetchFeed(section.query);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900">{section.heading}</h2>
          <p className="text-sm text-slate-600">{section.blurb}</p>
        </div>
        <a
          href={godesiUrl(section.moreHref)}
          target="_blank"
          rel="noopener"
          className={`text-sm font-bold ${site.accent}`}
        >
          {section.moreLabel} →
        </a>
      </div>

      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FeedCard
              key={"id" in item ? item.id : item.slug}
              item={item}
              accent={site.accent}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Nothing here just yet.{" "}
          <a
            href={godesiUrl(section.moreHref)}
            target="_blank"
            rel="noopener"
            className={`font-bold ${site.accent}`}
          >
            Check Godesi
          </a>{" "}
          or be the first to post.
        </div>
      )}
    </section>
  );
}
