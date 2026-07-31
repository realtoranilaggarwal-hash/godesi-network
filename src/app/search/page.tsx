import type { Metadata } from "next";
import { headers } from "next/headers";
import { AdSlot } from "@/components/AdSlot";
import { FeedSection } from "@/components/FeedSection";
import { SiteSearch } from "@/components/SiteSearch";
import { godesiUrl, siteForHost } from "@/lib/sites";

export const revalidate = 600;

export function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Metadata {
  const site = siteForHost(headers().get("host"));
  const query = searchParams.q?.trim();
  return {
    title: query ? `${query} — ${site.name}` : `Search — ${site.name}`,
    description: site.description,
    robots: { index: false, follow: true },
  };
}

/**
 * Searches every row the site already shows, but filtered by the visitor's
 * words — the same Godesi feed, no second index to keep in sync.
 */
export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const site = siteForHost(headers().get("host"));
  const query = searchParams.q?.trim() ?? "";
  const search = site.search ?? {
    placeholder: `Search ${site.name}`,
    suggestions: [],
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <section
        className={`rounded-3xl bg-gradient-to-r ${site.gradient} px-5 py-8 text-white sm:px-8`}
      >
        <h1 className="text-2xl font-black sm:text-3xl">
          {query ? `Results for “${query}”` : `Search ${site.name}`}
        </h1>
        <SiteSearch
          placeholder={search.placeholder}
          suggestions={search.suggestions}
          defaultValue={query}
        />
      </section>

      {query ? (
        site.sections.map((section, index) => (
          <div key={section.heading} className="space-y-8">
            <FeedSection
              site={site}
              section={{
                ...section,
                blurb: `${section.blurb} Matching “${query}”.`,
                query: { ...section.query, q: query, limit: "12" },
              }}
            />
            {index === 0 ? <AdSlot accent={site.accent} /> : null}
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-600">
          Type a skill, role, company or city above. Everything is pulled live
          from{" "}
          <a
            href={godesiUrl()}
            target="_blank"
            rel="noopener"
            className={`font-bold ${site.accent}`}
          >
            Godesi.com
          </a>
          .
        </p>
      )}
    </main>
  );
}
