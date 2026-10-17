import { fetchChatter } from "@/lib/chatter";
import { ComposePrompt, GapodiShell } from "@/components/gapodi/GapodiShell";
import { Timeline } from "@/components/gapodi/Timeline";

export async function GapodiHome({ before }: { before?: string }) {
  const feed = await fetchChatter({ before });
  return (
    <GapodiShell title="Home" feed={feed}>
      {before ? null : <ComposePrompt />}
      <Timeline
        items={feed.items}
        nextBefore={feed.nextBefore}
        basePath="/"
        empty="No posts yet. Be the first to say something on GoDesi Chatter."
      />
    </GapodiShell>
  );
}
