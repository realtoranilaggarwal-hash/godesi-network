import type { Metadata } from "next";
import { headers } from "next/headers";
import { AgentCard } from "@/components/realestate/AgentCard";
import { fetchAgents } from "@/lib/realEstate";
import { realEstateSiteForHost } from "@/lib/sites";

export const revalidate = 600;

const PAGE_SIZE = 30;

type Search = { q?: string; city?: string; page?: string };

export function generateMetadata({
  searchParams,
}: {
  searchParams: Search;
}): Metadata {
  const site = realEstateSiteForHost(headers().get("host"));
  const city = searchParams.city?.trim();
  return {
    title: city ? `Real estate agents in ${city}` : "Real estate agents",
    description: city
      ? `Real estate agents, brokers and property dealers in ${city}.`
      : site.description,
    alternates: {
      canonical: city ? `/agents?city=${encodeURIComponent(city)}` : "/agents",
    },
  };
}

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  realEstateSiteForHost(headers().get("host"));
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const q = searchParams.q?.trim() ?? "";
  const city = searchParams.city?.trim() ?? "";
  const { total, items } = await fetchAgents({
    limit: String(PAGE_SIZE),
    offset: String((page - 1) * PAGE_SIZE),
    ...(q ? { q } : {}),
    ...(city ? { city } : {}),
  });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (target: number) => {
    const params = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(city ? { city } : {}),
      page: String(target),
    });
    return `/agents?${params}`;
  };

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-black">
        {city ? `Real estate agents in ${city}` : "Real estate agents"}
      </h1>
      <form action="/agents" className="flex max-w-xl gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="City, agent or brokerage"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2"
        />
        <button className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700">
          Search
        </button>
      </form>
      <p className="text-sm text-slate-600">{total} found</p>
      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">No agents match that search.</p>
      )}
      {pages > 1 ? (
        <nav className="flex gap-3 text-sm font-semibold">
          {page > 1 ? <a href={pageHref(page - 1)}>← Previous</a> : null}
          <span>
            Page {page} of {pages}
          </span>
          {page < pages ? <a href={pageHref(page + 1)}>Next →</a> : null}
        </nav>
      ) : null}
    </main>
  );
}
