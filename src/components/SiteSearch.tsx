/** Hero search for the lookup sites, so the page stays a tool, not a wall of cards. */
export function SiteSearch({
  placeholder,
  suggestions,
  defaultValue = "",
}: {
  placeholder: string;
  suggestions: string[];
  defaultValue?: string;
}) {
  return (
    <div className="mt-5">
      <form action="/search" className="flex flex-wrap gap-2">
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label="Search"
          className="min-w-0 flex-1 rounded-xl border border-white/40 bg-white/95 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100"
        >
          Search
        </button>
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((suggestion) => (
          <a
            key={suggestion}
            href={`/search?q=${encodeURIComponent(suggestion)}`}
            className="rounded-full border border-white/40 px-2.5 py-1 text-xs font-semibold text-white/90 hover:bg-white/15"
          >
            {suggestion}
          </a>
        ))}
      </div>
    </div>
  );
}
