import type { Agent } from "@/lib/realEstate";
import { agentPlace } from "@/lib/realEstate";

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <a
      href={`/agents/${agent.slug}`}
      className={`flex gap-3 rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        agent.featured
          ? "border-amber-400 ring-1 ring-amber-300"
          : "border-slate-200"
      }`}
    >
      {agent.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={agent.logoUrl}
          alt=""
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-3xl">
          🏡
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-bold">{agent.name}</p>
        <p className="text-sm text-slate-600">{agentPlace(agent)}</p>
        <p className="mt-1 flex flex-wrap gap-1 text-xs font-semibold">
          {agent.featured ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
              ⭐ Featured
            </span>
          ) : null}
          {agent.verified ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">
              ✔ Licence verified
            </span>
          ) : agent.claimed ? (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">
              Claimed
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              Unclaimed
            </span>
          )}
        </p>
        {agent.specialties.length ? (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
            {agent.specialties.slice(0, 3).join(" · ")}
          </p>
        ) : null}
      </div>
    </a>
  );
}
