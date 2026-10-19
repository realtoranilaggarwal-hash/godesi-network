import { WhyAgent } from "@/components/realestate/WhyAgent";
import { GUIDES, type Guide } from "@/lib/guides";
import {
  AGENT_SIGNUP,
  agentPlace,
  fetchAgents,
  type Agent,
} from "@/lib/realEstate";
import { godesiUrl } from "@/lib/sites";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <a
      href={`/guides/${guide.slug}`}
      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-400 hover:shadow-sm"
    >
      <span aria-hidden className="text-3xl">
        {guide.icon}
      </span>
      <span className="min-w-0">
        <span className="block font-bold leading-snug">{guide.title}</span>
        <span className="mt-1 line-clamp-2 block text-sm text-slate-600">
          {guide.summary}
        </span>
      </span>
    </a>
  );
}

/** Agent pages live on RealEstateYP, so visitors stay inside the network. */
function agentPageUrl(slug: string) {
  return `https://realestateyp.com/agents/${encodeURIComponent(slug)}`;
}

/** A few real agents from the GoDesi feed, linked to their RealEstateYP page. */
export function AgentStrip({ agents }: { agents: Agent[] }) {
  if (!agents.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold">Agents on GoDesi</h2>
        <a
          href="https://realestateyp.com/agents"
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          More agents on RealEstateYP →
        </a>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {agents.map((agent) => (
          <a
            key={agent.slug}
            href={agentPageUrl(agent.slug)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
          >
            {agent.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agent.logoUrl}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xl"
              >
                🏠
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate font-semibold">{agent.name}</span>
              <span className="block truncate text-xs text-slate-500">
                {agentPlace(agent)}
                {agent.verified ? " · ✔ Verified" : ""}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function pickAgents(items: Agent[], count: number) {
  return [...items]
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        Number(Boolean(b.logoUrl)) - Number(Boolean(a.logoUrl)),
    )
    .slice(0, count);
}

export async function GuideHome() {
  const { items } = await fetchAgents({ limit: "12" });
  const agents = pickAgents(items, 3);
  const sample = agents[0];

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-6 text-white">
        <h1 className="text-3xl font-black">
          Do you need a real estate agent?
        </h1>
        <p className="mt-2 max-w-2xl text-white/90">
          Plain-English guides on what an agent does, what it costs since the
          2024 commission changes, and how to pick a good one — whether you are
          buying or selling.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <a
            href="#guides"
            className="rounded-xl bg-white px-4 py-2 text-slate-900 hover:bg-slate-100"
          >
            Read the guides
          </a>
          <a
            href="/guides/who-pays-the-agent"
            className="rounded-xl bg-white/15 px-4 py-2 hover:bg-white/25"
          >
            💵 Who pays the agent now?
          </a>
        </div>
      </section>

      <WhyAgent
        joinHref={godesiUrl(AGENT_SIGNUP)}
        agent={
          sample
            ? {
                name: sample.name,
                place: agentPlace(sample),
                logoUrl: sample.logoUrl,
                href: agentPageUrl(sample.slug),
                verified: sample.verified,
                claimed: sample.claimed,
                featured: sample.featured,
                yearsExperience: sample.yearsExperience,
                specialties: sample.specialties,
              }
            : null
        }
      />

      <section id="guides" className="scroll-mt-4">
        <h2 className="text-xl font-bold">Guides</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {GUIDES.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <AgentStrip agents={agents} />

      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm">
        <span aria-hidden className="text-2xl">
          🧑‍💼
        </span>
        <p className="min-w-0 flex-1">
          <span className="font-bold">Are you an agent?</span> Get a free
          profile and answer buyer and seller requests — no referral fee.
        </p>
        <a
          href="https://realestateyp.com/for-agents"
          className="rounded-xl bg-teal-600 px-3 py-1.5 font-semibold text-white hover:bg-teal-700"
        >
          How it works
        </a>
      </section>
    </main>
  );
}
