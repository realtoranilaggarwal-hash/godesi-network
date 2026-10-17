import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { fetchChatter } from "@/lib/chatter";
import { chatterSiteForHost } from "@/lib/sites";
import { ComposePrompt, GapodiShell } from "@/components/gapodi/GapodiShell";
import { Timeline } from "@/components/gapodi/Timeline";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { topic: string };
}): Promise<Metadata> {
  const site = chatterSiteForHost(headers().get("host"));
  const { topics } = await fetchChatter();
  const topic = topics.find((item) => item.id === params.topic);
  if (!topic) return { title: "Topic not found", robots: { index: false } };
  return {
    title: `${topic.label} chatter`,
    description: `${topic.label}: what desis are talking about on ${site.name}.`,
    alternates: { canonical: `https://${site.domain}/topic/${topic.id}` },
  };
}

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: { topic: string };
  searchParams: { before?: string };
}) {
  chatterSiteForHost(headers().get("host"));
  const feed = await fetchChatter({ topic: params.topic, before: searchParams.before });
  const topic = feed.topics.find((item) => item.id === params.topic);
  if (!topic) notFound();
  return (
    <GapodiShell title={`${topic.emoji} ${topic.label}`} feed={feed}>
      {searchParams.before ? null : <ComposePrompt />}
      <Timeline
        items={feed.items}
        nextBefore={feed.nextBefore}
        basePath={`/topic/${topic.id}`}
        empty={`No ${topic.label.toLowerCase()} posts yet.`}
      />
    </GapodiShell>
  );
}
