import { DJ_SIGNUP, godesiUrl, type SiteConfig } from "@/lib/sites";

const POST_LINKS: Record<string, { href: string; label: string }> = {
  desinewspaper: { href: "/news/report", label: "Report news" },
  diwali: { href: "/events/new", label: "Post your event" },
  iba: { href: "/signup", label: "List your business" },
  itplacement: { href: "/leads/new", label: "Post a requirement" },
  itplacementservices: { href: "/signup", label: "List your consultancy" },
  djswiki: { href: DJ_SIGNUP, label: "List your DJ service free" },
  eventringer: { href: "/events/new", label: "List your event free" },
  whyuserealtor: {
    href: "/leads/new?category=real-estate&do=buy",
    label: "Compare agents free",
  },
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
          {site.eventPages ? (
            <>
              <a
                href="/events"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                All events
              </a>
              <a
                href="/venues"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                Venues
              </a>
              <a
                href="/list-your-event"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                For organisers
              </a>
            </>
          ) : null}
          {site.kind === "realestate" ? (
            <>
              <a
                href="/agents"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                Agents
              </a>
              <a
                href="/properties"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                Properties
              </a>
              <a
                href="/for-agents"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                For agents
              </a>
            </>
          ) : null}
          {site.kind === "guide" ? (
            <>
              <a
                href="/#guides"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                Guides
              </a>
              <a
                href="https://realestateyp.com/agents"
                className="rounded-full px-3 py-1.5 hover:bg-white/15"
              >
                Find an agent
              </a>
            </>
          ) : null}
          <a
            href="/about"
            className="rounded-full px-3 py-1.5 hover:bg-white/15"
          >
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
          {site.name} is part of the GoDesi network: profiles, guides and
          listings shared by the desi community.
        </p>
        <p className="font-semibold">
          Powered by{" "}
          <a href={godesiUrl()} className={`font-bold ${site.accent}`}>
            GoDesi.com
          </a>
        </p>
        {site.kind === "guide" ? (
          <p className="text-xs text-slate-500">
            REALTOR® is a federally registered collective membership mark of the
            National Association of REALTORS®, which identifies real estate
            professionals who are members. This site is not affiliated with
            NAR. Guides are general information, not legal or financial advice.
          </p>
        ) : null}
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} {site.domain} · a Godesi network site
        </p>
      </div>
    </footer>
  );
}
