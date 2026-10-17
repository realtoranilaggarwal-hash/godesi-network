import Link from "next/link";
import { age, bodyParts, tagPath, type ChatterItem } from "@/lib/chatter";

function Avatar({ author }: { author: ChatterItem["author"] }) {
  if (author.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={author.avatarUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-fuchsia-500 text-lg font-black text-white">
      {author.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function Body({ body }: { body: string }) {
  return (
    <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-slate-900">
      {bodyParts(body).map((part, index) =>
        part.kind === "text" ? (
          <span key={index}>{part.text}</span>
        ) : part.kind === "tag" ? (
          <Link key={index} href={tagPath(part.tag)} className="text-rose-600 hover:underline">
            {part.text}
          </Link>
        ) : (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="nofollow ugc noopener noreferrer"
            className="text-rose-600 hover:underline"
          >
            {part.text}
          </a>
        ),
      )}
    </p>
  );
}

/** One post in the Twitter-style timeline; every action opens it on godesi.com. */
export function PostCard({ post, large = false }: { post: ChatterItem; large?: boolean }) {
  return (
    <article className="flex gap-3 border-b border-slate-200 px-4 py-3 transition hover:bg-slate-50">
      <Avatar author={post.author} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
          {post.author.url ? (
            <a href={post.author.url} className="font-bold text-slate-900 hover:underline">
              {post.author.name}
            </a>
          ) : (
            <span className="font-bold text-slate-900">{post.author.name}</span>
          )}
          {post.author.username ? (
            <span className="text-slate-500">@{post.author.username}</span>
          ) : null}
          <span className="text-slate-400">·</span>
          <Link href={`/post/${post.id}`} className="text-slate-500 hover:underline">
            <time dateTime={post.createdAt}>{age(post.createdAt)}</time>
          </Link>
        </p>
        <p className="mb-1 text-xs text-slate-500">
          <Link href={`/topic/${post.topic.id}`} className="hover:underline">
            {post.topic.emoji} {post.topic.label}
          </Link>
          {post.city ? <> · 📍 {post.city}</> : null}
        </p>
        <div className={large ? "text-lg" : ""}>
          <Body body={post.body} />
        </div>
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt=""
            loading="lazy"
            className="mt-2 max-h-[420px] w-full rounded-2xl border border-slate-200 object-cover"
          />
        ) : null}
        <div className="mt-2 flex max-w-sm justify-between text-sm text-slate-500">
          <Link href={`/post/${post.id}`} className="flex items-center gap-1 hover:text-sky-600">
            💬 {post.replyCount}
          </Link>
          <a href={post.url} className="flex items-center gap-1 hover:text-rose-600">
            ❤️ {post.likeCount}
          </a>
          <a href={post.url} className="flex items-center gap-1 hover:text-emerald-600">
            ↩️ Reply on GoDesi
          </a>
        </div>
      </div>
    </article>
  );
}
