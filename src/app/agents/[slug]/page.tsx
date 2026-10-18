import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { jsonLd } from "@/lib/jsonLd";
import { agentPlace, fetchAgent } from "@/lib/realEstate";
import { realEstateSiteForHost } from "@/lib/sites";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  realEstateSiteForHost(headers().get("host"));
  const agent = await fetchAgent(params.slug);
  if (!agent) return {};
  const place = agentPlace(agent);
  return {
    title: `${agent.name} — real estate ${agent.kind} in ${place}`,
    description:
      agent.description?.slice(0, 160) ??
      `${agent.name}, real estate ${agent.kind} serving ${place}.`,
    alternates: { canonical: `/agents/${agent.slug}` },
  };
}

const PROFILE_LINKS = [
  { key: "zillowUrl", label: "🏡 Zillow" },
  { key: "realtorUrl", label: "🏘️ Realtor.com" },
  { key: "homesUrl", label: "🏠 Homes.com" },
] as const;

export default async function AgentPage({
  params,
}: {
  params: { slug: string };
}) {
  const site = realEstateSiteForHost(headers().get("host"));
  const agent = await fetchAgent(params.slug);
  if (!agent) notFound();
  const place = agentPlace(agent);
  const whatsapp = agent.whatsappNumber?.replace(/\D/g, "");

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: agent.name,
            url: `https://${site.domain}/agents/${agent.slug}`,
            ...(agent.logoUrl ? { image: agent.logoUrl } : {}),
            ...(agent.description ? { description: agent.description } : {}),
            ...(agent.phone ? { telephone: agent.phone } : {}),
            ...(agent.email ? { email: agent.email } : {}),
            address: {
              "@type": "PostalAddress",
              addressLocality: agent.city,
              ...(agent.state ? { addressRegion: agent.state } : {}),
              ...(agent.country ? { addressCountry: agent.country } : {}),
            },
            sameAs: [
              agent.godesiUrl,
              agent.websiteUrl,
              agent.zillowUrl,
              agent.realtorUrl,
              agent.homesUrl,
            ].filter(Boolean),
          }),
        }}
      />
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
        {agent.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={agent.logoUrl}
            alt=""
            className="h-28 w-28 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-6xl">
            🏡
          </span>
        )}
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-black">{agent.name}</h1>
          <p className="text-slate-600">
            Real estate {agent.kind} · {place}
          </p>
          <p className="flex flex-wrap gap-1 text-xs font-semibold">
            {agent.featured ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                ⭐ Featured
              </span>
            ) : null}
            {agent.verified ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">
                ✔ Licence verified by GoDesi
              </span>
            ) : agent.claimed ? (
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">
                Claimed by the agent
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                Unclaimed: built from public information
              </span>
            )}
          </p>
          {agent.licenseNumber ? (
            <p className="text-sm text-slate-600">
              Licence no. {agent.licenseNumber}
            </p>
          ) : null}
          {agent.yearsExperience ? (
            <p className="text-sm text-slate-600">
              {agent.yearsExperience} years in real estate
            </p>
          ) : null}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 text-sm font-semibold">
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener"
            className="rounded-xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
          >
            💬 WhatsApp
          </a>
        ) : null}
        {agent.phone ? (
          <a
            href={`tel:${agent.phone}`}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          >
            📞 {agent.phone}
          </a>
        ) : null}
        {agent.email ? (
          <a
            href={`mailto:${agent.email}`}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          >
            ✉️ Email
          </a>
        ) : null}
        <a
          href={agent.godesiUrl}
          className="rounded-xl bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
        >
          Send an enquiry on GoDesi
        </a>
        {agent.websiteUrl ? (
          <a
            href={agent.websiteUrl}
            target="_blank"
            rel="noopener nofollow"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2"
          >
            🌐 Website
          </a>
        ) : null}
        {PROFILE_LINKS.map(({ key, label }) =>
          agent[key] ? (
            <a
              key={key}
              href={agent[key] as string}
              target="_blank"
              rel="noopener nofollow"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2"
            >
              {label}
            </a>
          ) : null,
        )}
      </div>

      {agent.description ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">About</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
            {agent.description}
          </p>
        </section>
      ) : null}

      {agent.specialties.length || agent.certifications.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Services</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {[...agent.specialties, ...agent.certifications].map((item) => (
              <li key={item} className="rounded-full bg-slate-100 px-3 py-1">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl bg-indigo-50 p-5 text-sm">
        {agent.claimed ? (
          <p>
            Is this you? Update your profile on GoDesi and it changes here too.{" "}
            <a href={agent.godesiUrl} className="font-semibold text-indigo-600">
              Open on GoDesi →
            </a>
          </p>
        ) : (
          <p>
            Is this you? Claim this profile free on GoDesi to add photos,
            services and contact details, or to correct or remove it.{" "}
            <a href={agent.godesiUrl} className="font-semibold text-indigo-600">
              Claim it on GoDesi →
            </a>
          </p>
        )}
      </section>
    </main>
  );
}
