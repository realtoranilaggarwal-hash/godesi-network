import type { Metadata } from "next";
import { headers } from "next/headers";
import { fetchChatter, tagPath } from "@/lib/chatter";
import { chatterSiteForHost } from "@/lib/sites";
import { ComposePrompt, GapodiShell } from "@/components/gapodi/GapodiShell";
import { Timeline } from "@/components/gapodi/Timeline";

export const revalidate = 120;

function clean(tag: string) {
  let decoded = tag;
  try {
    decoded = decodeURIComponent(tag);
  } catch {}
  return decoded.replace(/^#/, "").toLowerCase();
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const site = chatterSiteForHost(headers().get("host"));
  const tag = clean(params.tag);
  return {
    title: `#${tag}`,
    description: `What desis are saying about #${tag} on ${site.name}.`,
    alternates: { canonical: `https://${site.domain}${tagPath(tag)}` },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { tag: string };
  searchParams: { before?: string };
}) {
  chatterSiteForHost(headers().get("host"));
  const tag = clean(params.tag);
  const feed = await fetchChatter({ tag, before: searchParams.before });
  return (
    <GapodiShell title={`#${tag}`} feed={feed}>
      {searchParams.before ? null : <ComposePrompt />}
      <Timeline
        items={feed.items}
        nextBefore={feed.nextBefore}
        basePath={tagPath(tag)}
        empty={`No posts with #${tag} yet.`}
      />
    </GapodiShell>
  );
}
