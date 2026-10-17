import Link from "next/link";
import type { ReactNode } from "react";
import { CHATTER_HOME, GAPODI_SIGNUP, tagPath, type ChatterFeed } from "@/lib/chatter";
import { godesiUrl } from "@/lib/sites";

/** Three columns like Twitter: menu, timeline, trending. Plain links only, no polling. */
export function GapodiShell({
  title,
  feed,
  children,
}: {
  title: ReactNode;
  feed: Pick<ChatterFeed, "trending" | "topics">;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl">
      <nav className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-1 px-3 py-4 md:flex">
        <Link href="/" className="mb-4 flex items-center gap-2 px-3 text-2xl font-black text-rose-600">
          <span aria-hidden>💬</span> Gapodi
        </Link>
        <Link href="/" className="rounded-full px-3 py-2 text-lg font-semibold hover:bg-slate-100">
          🏠 Home
        </Link>
        {feed.topics.slice(0, 6).map((topic) => (
          <Link
            key={topic.id}
            href={`/topic/${topic.id}`}
            className="rounded-full px-3 py-1.5 text-[15px] hover:bg-slate-100"
          >
            {topic.emoji} {topic.label}
          </Link>
        ))}
        <a
          href={CHATTER_HOME}
          className="mt-4 rounded-full bg-rose-600 px-4 py-3 text-center font-bold text-white hover:bg-rose-700"
        >
          Post on GoDesi
        </a>
        <p className="mt-auto px-3 text-xs text-slate-500">
          Posts come from{" "}
          <a href={godesiUrl("/chatter?ref=gapodi")} className="underline">
            GoDesi Chatter
          </a>
          .
        </p>
      </nav>

      <main className="min-h-screen min-w-0 flex-1 border-x border-slate-200 bg-white">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-black text-rose-600 md:hidden" aria-label="Gapodi home">
              💬
            </Link>
            <h1 className="min-w-0 truncate text-xl font-black">{title}</h1>
            <a
              href={CHATTER_HOME}
              className="ml-auto rounded-full bg-rose-600 px-3 py-1.5 text-sm font-bold text-white md:hidden"
            >
              Post
            </a>
          </div>
          <div className="-mx-1 mt-2 flex gap-1 overflow-x-auto text-sm md:hidden">
            {feed.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topic/${topic.id}`}
                className="shrink-0 rounded-full border border-slate-200 px-3 py-1"
              >
                {topic.emoji} {topic.label}
              </Link>
            ))}
          </div>
        </header>
        {children}
      </main>

      <aside className="sticky top-0 hidden h-screen w-80 shrink-0 space-y-4 overflow-y-auto px-4 py-4 lg:block">
        <section className="rounded-2xl bg-slate-100 p-4">
          <h2 className="text-lg font-black">Trending on Gapodi</h2>
          {feed.trending.length ? (
            <ol className="mt-2 space-y-2">
              {feed.trending.slice(0, 10).map((item) => (
                <li key={item.tag}>
                  <Link href={tagPath(item.tag)} className="block hover:underline">
                    <span className="font-bold">#{item.tag}</span>
                    <span className="block text-xs text-slate-500">
                      {item.count} post{item.count === 1 ? "" : "s"} this week
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No #words yet this week. Start one on GoDesi.</p>
          )}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="font-black">New to Gapodi?</h2>
          <p className="mt-1 text-sm text-slate-600">
            Join GoDesi free to post, reply, like and follow. Your posts show here too.
          </p>
          <a
            href={GAPODI_SIGNUP}
            className="mt-3 block rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-bold text-white"
          >
            Join free on GoDesi
          </a>
        </section>
      </aside>
    </div>
  );
}

/** The "What's happening?" box: a link to the real composer on godesi.com. */
export function ComposePrompt() {
  return (
    <a
      href={CHATTER_HOME}
      className="flex items-center gap-3 border-b border-slate-200 px-4 py-4 hover:bg-slate-50"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-xl">🙂</span>
      <span className="flex-1 text-lg text-slate-500">What&apos;s happening, Gapodi?</span>
      <span className="rounded-full bg-rose-600 px-4 py-2 text-sm font-bold text-white">Post</span>
    </a>
  );
}
