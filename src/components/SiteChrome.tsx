import { godesiUrl, type SiteConfig } from "@/lib/sites";

const POST_LINKS: Record<string, { href: string; label: string }> = {
  desinewspaper: { href: "/news/report", label: "Report news" },
  diwali: { href: "/events/new", label: "Post your event" },
  iba: { href: "/signup", label: "List your business" },
  itplacement: { href: "/leads/new", label: "Post a requirement" },
  itplacementservices: { href: "/signup", label: "List your consultancy" },
};

/** A site without its own call to action still gets a working header. */
const DEFAULT_POST = { href: "/signup", label: "Post on Godesi" };

export function SiteHeader({ site }: { site: SiteConfig }) {
  const post = POST_LINKS[site.key] ?? DEFAULT_POST;

  return (
    <header className={`bg-gradient-to-r ${site.gradient} text-white`}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <a href="/" className="flex items-center gap-2 text-lg font-black">
          <span aria-hidden>{site.emoji}</span>
          {site.name}
        </a>
        <nav className="ml-auto flex flex-wrap items-center gap-2 text-sm font-semibold">
          <a href="/about" className="rounded-full px-3 py-1.5 hover:bg-white/15">
            About
          </a>
          <a
            href={godesiUrl(post.href)}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25"
          >
            {post.label}
          </a>
          <a
            href={godesiUrl()}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-white px-3 py-1.5 font-bold text-slate-900 hover:bg-slate-100"
          >
            Godesi.com
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ site }: { site: SiteConfig }) {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-sm text-slate-600">
        <p className="font-bold text-slate-900">
          {site.emoji} {site.name}
        </p>
        <p className="max-w-2xl">
          {site.name} is part of the Godesi network. Stories, events and
          listings shown here are published by the community on{" "}
          <a
            href={godesiUrl()}
            target="_blank"
            rel="noopener"
            className={`font-bold ${site.accent}`}
          >
            Godesi.com
          </a>
          , where you can read them in full, contact the poster and post your
          own — free.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-semibold">
          <a href={godesiUrl("/news")} target="_blank" rel="noopener">
            Desi news
          </a>
          <a href={godesiUrl("/events")} target="_blank" rel="noopener">
            Events
          </a>
          <a href={godesiUrl("/search")} target="_blank" rel="noopener">
            Business directory
          </a>
          <a href={godesiUrl("/live-radio")} target="_blank" rel="noopener">
            Live desi radio
          </a>
          <a href={godesiUrl("/live-tv")} target="_blank" rel="noopener">
            Live desi TV
          </a>
          <a href={godesiUrl("/contact")} target="_blank" rel="noopener">
            Contact
          </a>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} {site.domain} · a Godesi network site
        </p>
      </div>
    </footer>
  );
}
