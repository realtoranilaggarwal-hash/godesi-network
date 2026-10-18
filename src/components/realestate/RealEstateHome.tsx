import { AgentCard } from "@/components/realestate/AgentCard";
import { PropertyCard } from "@/components/realestate/PropertyCard";
import { WhyAgent } from "@/components/realestate/WhyAgent";
import {
  AGENT_SIGNUP,
  agentPlace,
  fetchAgents,
  fetchProperties,
} from "@/lib/realEstate";
import { godesiUrl } from "@/lib/sites";

export async function RealEstateHome() {
  const [agents, properties] = await Promise.all([
    fetchAgents({ limit: "12", facets: "1" }),
    fetchProperties({ limit: "6" }),
  ]);
  const sample =
    agents.items.find((agent) => agent.logoUrl && agent.featured) ??
    agents.items.find((agent) => agent.logoUrl) ??
    agents.items[0];

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-700 p-6 text-white">
        <h1 className="text-3xl font-black">
          Find a real estate agent near you
        </h1>
        <p className="mt-2 max-w-2xl text-white/90">
          Agents, brokers and property dealers, with their services, areas and
          the homes they have for sale or rent.
        </p>
        <form action="/agents" className="mt-4 flex max-w-xl gap-2">
          <input
            name="q"
            placeholder="City, agent or brokerage"
            className="min-w-0 flex-1 rounded-xl px-3 py-2 text-slate-900"
          />
          <button className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-900 hover:bg-amber-300">
            Search
          </button>
        </form>
      </section>

      <WhyAgent
        action={godesiUrl("/leads/new")}
        joinHref={godesiUrl(AGENT_SIGNUP)}
        agent={
          sample
            ? {
                name: sample.name,
                place: agentPlace(sample),
                logoUrl: sample.logoUrl,
                href: `/agents/${sample.slug}`,
                verified: sample.verified,
                claimed: sample.claimed,
                featured: sample.featured,
                yearsExperience: sample.yearsExperience,
                specialties: sample.specialties,
              }
            : null
        }
      />

      <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">
          Real estate agents — get discovered on two websites
        </p>
        <h2 className="mt-1 text-xl font-bold">
          Your next client could be looking for you right now.
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          One profile, two websites: your free GoDesi card shows on GoDesi.com
          and here on RealEstateYP. Update it once on GoDesi and both change.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
          <a
            href={godesiUrl(AGENT_SIGNUP)}
            className="rounded-xl bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
          >
            Claim or create your profile free
          </a>
          <a
            href="/for-agents"
            className="rounded-xl border border-indigo-300 bg-white px-3 py-2 text-indigo-700 hover:bg-indigo-50"
          >
            How it works for agents
          </a>
          <a
            href={godesiUrl("/pricing")}
            className="rounded-xl border border-indigo-300 bg-white px-3 py-2 text-indigo-700 hover:bg-indigo-50"
          >
            ⭐ Get Featured
          </a>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-xl font-bold">Agents and brokers</h2>
          <a href="/agents" className="text-sm font-semibold text-indigo-600">
            See all {agents.total} →
          </a>
        </div>
        {agents.items.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {agents.items.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">No agents listed yet.</p>
        )}
        {agents.cities?.length ? (
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {agents.cities.slice(0, 24).map((city) => (
              <a
                key={`${city.city}-${city.state}`}
                href={`/agents?city=${encodeURIComponent(city.city)}`}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 hover:bg-slate-100"
              >
                {city.city} ({city.count})
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-xl font-bold">Homes for sale and rent</h2>
          <a
            href="/properties"
            className="text-sm font-semibold text-indigo-600"
          >
            See all →
          </a>
        </div>
        {properties.items.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {properties.items.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            No properties posted yet.
          </p>
        )}
        <a
          href={godesiUrl("/listings/new?kind=PROPERTY_SALE")}
          className="mt-3 inline-block text-sm font-semibold text-indigo-600"
        >
          🏷️ Post a property free on GoDesi →
        </a>
      </section>
    </main>
  );
}
