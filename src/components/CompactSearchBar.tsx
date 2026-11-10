import { SiteSearch } from "@/components/SiteSearch";
import type { SiteConfig } from "@/lib/sites";

/** Search on top of every listing page on search-first event sites. */
export function CompactSearchBar({ site }: { site: SiteConfig }) {
  if (!site.compact || !site.search) return null;
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r ${site.gradient} px-4 pb-4 pt-0.5 sm:px-6`}
    >
      <SiteSearch
        placeholder={site.search.placeholder}
        suggestions={site.search.suggestions}
      />
    </div>
  );
}
