import { headers } from "next/headers";
import { GapodiShell } from "@/components/gapodi/GapodiShell";
import { fetchChatter } from "@/lib/chatter";
import { godesiUrl, siteForHost } from "@/lib/sites";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const site = siteForHost(headers().get("host"));

  if (site.kind === "chatter") {
    const feed = await fetchChatter();
    return (
      <GapodiShell title={`About ${site.name}`} feed={feed}>
        <div className="space-y-4 px-4 py-6">
          {site.about.map((paragraph) => (
            <p key={paragraph} className="text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
      </GapodiShell>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-black">
        {site.emoji} About {site.name}
      </h1>
      {site.about.map((paragraph) => (
        <p key={paragraph} className="text-slate-700">
          {paragraph}
        </p>
      ))}
      <p className="text-slate-700">
        Questions, corrections or partnership ideas?{" "}
        <a
          href={godesiUrl("/contact")}
          target="_blank"
          rel="noopener"
          className={`font-bold ${site.accent}`}
        >
          Contact the Godesi team
        </a>
        .
      </p>
    </main>
  );
}
