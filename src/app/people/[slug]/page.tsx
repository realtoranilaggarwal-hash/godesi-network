import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { FeedCard, picture } from "@/components/FeedCard";
import { fetchEliteProfile } from "@/lib/elite";
import { externalUrl } from "@/lib/externalUrl";
import { fetchFeed, isElite } from "@/lib/feed";
import { jsonLd } from "@/lib/jsonLd";
import { eliteSiteForHost } from "@/lib/sites";

export const revalidate = 600;

function place(...parts: (string | null)[]) {
  return parts.filter(Boolean).join(", ");
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  eliteSiteForHost(headers().get("host"));
  const person = await fetchEliteProfile(params.slug);
  if (!person) return {};
  const role = [person.businessName, person.category].filter(Boolean).join(" · ");
  return {
    title: `${person.fullName} — ${role}`,
    description: person.shortBio.slice(0, 160),
    alternates: { canonical: `/people/${person.slug}` },
    openGraph: person.photoUrl ? { images: [person.photoUrl] } : undefined,
  };
}

export default async function PersonPage({
  params,
}: {
  params: { slug: string };
}) {
  const site = eliteSiteForHost(headers().get("host"));
  const person = await fetchEliteProfile(params.slug);
  if (!person) notFound();

  const where = place(person.city, person.state, person.country);
  const photo = picture(person.photoUrl);
  const website = externalUrl(person.websiteUrl);
  const video = externalUrl(person.videoUrl);
  const socials = person.socialLinks
    .map((link) => externalUrl(link))
    .filter((link): link is string => Boolean(link));
  const source = externalUrl(person.sourceUrl);
  const related = (
    await fetchFeed({ kind: "elite", category: person.category, limit: "7" })
  )
    .filter(isElite)
    .filter((item) => item.slug !== person.slug)
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Person",
            name: person.fullName,
            url: `https://${site.domain}/people/${person.slug}`,
            description: person.shortBio,
            ...(person.photoUrl ? { image: person.photoUrl } : {}),
            ...(person.businessName
              ? { worksFor: { "@type": "Organization", name: person.businessName } }
              : {}),
            ...(person.awards.length ? { award: person.awards } : {}),
            address: {
              "@type": "PostalAddress",
              addressLocality: person.city,
              ...(person.state ? { addressRegion: person.state } : {}),
              ...(person.country ? { addressCountry: person.country } : {}),
            },
            sameAs: [person.url, website, ...socials].filter(Boolean),
          }),
        }}
      />

      <nav className="text-sm text-slate-500">
        <a href="/" className="hover:underline">
          {site.name}
        </a>{" "}
        › {person.category}
      </nav>

      <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
        {photo ? (
          <figure className="shrink-0 sm:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={person.fullName}
              className="max-h-72 w-full rounded-2xl bg-slate-100 object-contain"
            />
            {person.photoCredit ? (
              <figcaption className="mt-1 text-[10px] leading-tight text-slate-400">
                {person.photoCredit}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-black">{person.fullName}</h1>
            <p className={`font-semibold ${site.accent}`}>
              {[person.businessName, person.category].filter(Boolean).join(" · ")}
            </p>
            <p className="text-sm text-slate-500">
              {[where, person.yearsExperience ? `${person.yearsExperience}+ years` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          {person.awardTitle ? (
            <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900">
              🏆 {person.awardTitle}
              {person.awardYear ? ` (${person.awardYear})` : ""}
            </p>
          ) : null}
          <p className="whitespace-pre-line text-slate-700">{person.shortBio}</p>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener nofollow"
                className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200"
              >
                🌐 Website
              </a>
            ) : null}
            {video ? (
              <a
                href={video}
                target="_blank"
                rel="noopener nofollow"
                className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200"
              >
                ▶️ Video
              </a>
            ) : null}
            {socials.map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener nofollow"
                className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200"
              >
                {new URL(link).hostname.replace(/^www\./, "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {person.achievements || person.awards.length ? (
        <section className="grid gap-4 sm:grid-cols-2">
          {person.achievements ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="font-bold">Achievements</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                {person.achievements}
              </p>
            </div>
          ) : null}
          {person.awards.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="font-bold">Awards</h2>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                {person.awards.map((award) => (
                  <li key={award}>{award}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
        {person.claimed ? (
          <p>This profile is managed by {person.fullName} on GoDesi Elite.</p>
        ) : (
          <p>
            Written by the GoDesi desk from public record
            {source ? (
              <>
                {" "}
                (
                <a href={source} target="_blank" rel="noopener nofollow" className="underline">
                  {person.sourceName ?? "source"}
                </a>
                )
              </>
            ) : null}
            . Is this you?{" "}
            <a
              href={person.claimUrl}
              target="_blank"
              rel="noopener"
              className="font-bold underline"
            >
              Claim it free
            </a>{" "}
            to correct and complete it.
          </p>
        )}
      </section>

      {related.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-black">More in {person.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <FeedCard key={item.slug} item={item} accent={site.accent} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
