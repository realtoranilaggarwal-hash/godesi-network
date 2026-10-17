import Link from "next/link";
import type { ChatterItem } from "@/lib/chatter";
import { PostCard } from "@/components/gapodi/PostCard";

export function Timeline({
  items,
  nextBefore,
  basePath,
  empty,
}: {
  items: ChatterItem[];
  nextBefore: string | null;
  basePath: string;
  empty: string;
}) {
  if (!items.length) {
    return <p className="px-4 py-10 text-center text-slate-500">{empty}</p>;
  }
  return (
    <>
      {items.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {nextBefore ? (
        <Link
          href={`${basePath}?before=${encodeURIComponent(nextBefore)}`}
          className="block px-4 py-4 text-center font-semibold text-rose-600 hover:bg-slate-50"
        >
          Older posts
        </Link>
      ) : null}
    </>
  );
}
