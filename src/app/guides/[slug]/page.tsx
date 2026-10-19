import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  AgentStrip,
  GuideCard,
  pickAgents,
} from "@/components/guide/GuideHome";
import { AgentRequestForm } from "@/components/realestate/AgentRequestForm";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { fetchAgents } from "@/lib/realEstate";
import { guideSiteForHost } from "@/lib/sites";

export const revalidate = 600;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = guideBySlug(params.slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.summary,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const site = guideSiteForHost(headers().get("host"));
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();

  const { items } = await fetchAgents({ limit: "12" });
  const agents = pickAgents(items, 3);
  const mode = guide.audience === "sell" ? "sell" : "buy";
  const more = GUIDES.filter((other) => other.slug !== guide.slug)
    .filter(
      (other) => other.audience === guide.audience || other.audience === "both",
    )
    .slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.summary,
      mainEntityOfPage: `https://${site.domain}/guides/${guide.slug}`,
      publisher: { "@type": "Organization", name: site.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="min-w-0 space-y-5">
        <header className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-teal-700">
            <a href="/#guides" className="hover:underline">
              Guides
            </a>{" "}
            ·{" "}
            {guide.audience === "sell"
              ? "Selling"
              : guide.audience === "buy"
                ? "Buying"
                : "Buying & selling"}
          </p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">
            <span aria-hidden>{guide.icon}</span> {guide.title}
          </h1>
          <p className="mt-2 text-slate-600">{guide.summary}</p>
        </header>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-2 leading-relaxed text-slate-700"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Common questions</h2>
          <dl className="mt-2 space-y-3">
            {guide.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold">{item.q}</dt>
                <dd className="text-sm text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <AgentStrip agents={agents} />

        {more.length ? (
          <section>
            <h2 className="text-lg font-bold">Read next</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {more.map((other) => (
                <GuideCard key={other.slug} guide={other} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="text-xs text-slate-500">
          General information only, not legal, tax or financial advice. Rules
          differ by state; check with a licensed professional.
        </p>
      </article>

      <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
        <div className="rounded-2xl border-2 border-teal-300 bg-teal-50 p-4">
          <p className="font-bold">
            {guide.audience === "both"
              ? "🏠 Buying or selling soon?"
              : mode === "sell"
                ? "🏷️ Selling soon?"
                : "🏡 Buying soon?"}
          </p>
          <p className="mb-3 mt-1 text-sm text-slate-600">
            Compare local agents free, right here.
          </p>
          <AgentRequestForm mode={mode} choose={guide.audience === "both"} />
        </div>
      </aside>
    </main>
  );
}
