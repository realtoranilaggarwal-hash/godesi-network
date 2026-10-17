import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { excerpt, fetchChatter, fetchChatterThread, safeHref } from "@/lib/chatter";
import { chatterSiteForHost } from "@/lib/sites";
import { GapodiShell } from "@/components/gapodi/GapodiShell";
import { PostCard } from "@/components/gapodi/PostCard";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  chatterSiteForHost(headers().get("host"));
  const thread = await fetchChatterThread(params.id);
  if (!thread) return { title: "Post not found", robots: { index: false } };
  const { post } = thread;
  const title = `${post.author.name} on Gapodi: “${excerpt(post.body, 60)}”`;
  const description = excerpt(post.body, 160);
  return {
    title,
    description,
    // The post lives on GoDesi Chatter; Gapodi is a second window onto it.
    alternates: { canonical: post.url.split("?")[0] },
    openGraph: {
      title,
      description,
      type: "article",
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
    twitter: { card: post.imageUrl ? "summary_large_image" : "summary", title, description },
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  chatterSiteForHost(headers().get("host"));
  const [thread, feed] = await Promise.all([fetchChatterThread(params.id), fetchChatter()]);
  if (!thread) notFound();
  const { post, parent, replies } = thread;

  return (
    <GapodiShell
      title={
        <Link href="/" className="hover:underline">
          ← Post
        </Link>
      }
      feed={feed}
    >
      {parent ? (
        <p className="border-b border-slate-200 px-4 py-2 text-sm text-slate-500">
          Replying to{" "}
          <Link href={`/post/${parent.id}`} className="font-semibold text-rose-600 hover:underline">
            {parent.author}
          </Link>
        </p>
      ) : null}
      <PostCard post={post} large />
      <a
        href={safeHref(post.url)}
        className="flex items-center justify-between border-b border-slate-200 px-4 py-3 hover:bg-slate-50"
      >
        <span className="text-slate-500">Have something to say?</span>
        <span className="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white">
          Reply on GoDesi
        </span>
      </a>
      {replies.length ? (
        replies.map((reply) => <PostCard key={reply.id} post={reply} />)
      ) : (
        <p className="px-4 py-8 text-center text-slate-500">No replies yet.</p>
      )}
    </GapodiShell>
  );
}
