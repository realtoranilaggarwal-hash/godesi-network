import type { Metadata } from "next";
import { headers } from "next/headers";
import { AGENT_SIGNUP } from "@/lib/realEstate";
import { godesiUrl, realEstateSiteForHost } from "@/lib/sites";

export const metadata: Metadata = {
  title: "Real estate agents: get more buyer and seller leads, free",
  description:
    "Join RealEstateYP and GoDesi free. Your agent profile shows on both websites, buyers and sellers in our community send requests, and there is no referral fee on your commission.",
  alternates: { canonical: "/for-agents" },
};

const PERKS = [
  {
    icon: "🙋",
    title: "Real people asking for an agent",
    body: "Buyers and sellers post what they need, in their city, and you see the request.",
  },
  {
    icon: "🌐",
    title: "One profile, two websites",
    body: "Your free GoDesi card also shows here on RealEstateYP. Update it once and both change.",
  },
  {
    icon: "🤝",
    title: "No referral fee",
    body: "We never take a cut of your commission. Your profile is free; paid plans are optional.",
  },
];

const LOOKING_FOR = [
  "Licensed agents and brokers in good standing",
  "People who know their local market and neighbourhoods",
  "Quick replies — buyers and sellers are comparing agents",
  "Great service, so happy clients come back and refer friends",
  "A plus: you speak Hindi, Gujarati, Punjabi, Urdu, Tamil, Telugu or another community language",
];

const STEPS = [
  {
    title: "Claim or create your profile",
    body: "Add your photo, brokerage, licence, areas you serve and links to your Zillow, Realtor.com and Homes.com profiles.",
  },
  {
    title: "Get found",
    body: "Your card shows in agent searches on GoDesi and RealEstateYP, and buyers and sellers can message you on WhatsApp.",
  },
  {
    title: "Answer requests",
    body: "Open the buyer and seller requests in your area. Featured agents see contact details right away and sit at the top of their city.",
  },
];

const FAQ = [
  {
    q: "Does it cost anything to join?",
    a: "No. Your profile is free. A Featured plan is optional and puts you at the top of your city with buyer and seller contact details unlocked.",
  },
  {
    q: "Do you take a referral fee?",
    a: "No. You keep your full commission. We don't sit between you and your client.",
  },
  {
    q: "Where do the requests come from?",
    a: "From GoDesi members who use the free Compare agents box or post a requirement when they plan to buy, sell or rent.",
  },
  {
    q: "Can I fix or remove a profile built from public information?",
    a: "Yes. Profiles marked Unclaimed were built from public business information. Claim yours on GoDesi to correct it, or ask us to remove it.",
  },
];

export default function ForAgentsPage() {
  realEstateSiteForHost(headers().get("host"));
  const join = godesiUrl(AGENT_SIGNUP);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-700 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-white/80">
          For real estate agents
        </p>
        <h1 className="mt-1 text-3xl font-black">
          Get more buyer and seller leads — free
        </h1>
        <p className="mt-2 max-w-2xl text-white/90">
          Our community buys, sells and rents homes every day. Put your profile
          in front of them and answer their requests, with no referral fee.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <a
            href={join}
            className="rounded-xl bg-amber-400 px-4 py-2 text-slate-900 hover:bg-amber-300"
          >
            Join free
          </a>
          <a
            href={godesiUrl("/leads?category=Real%20Estate%20Agents")}
            className="rounded-xl bg-white/15 px-4 py-2 hover:bg-white/25"
          >
            See buyer and seller requests
          </a>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {PERKS.map((perk) => (
          <div
            key={perk.title}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <span aria-hidden className="text-2xl">
              {perk.icon}
            </span>
            <div>
              <p className="font-bold">{perk.title}</p>
              <p className="text-sm text-slate-600">{perk.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">Who we&apos;re looking for</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {LOOKING_FOR.map((item) => (
              <li key={item}>✔ {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold">How it works</h2>
          <ol className="mt-2 space-y-2 text-sm text-slate-700">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <span className="font-semibold">{step.title}.</span>{" "}
                  {step.body}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold">Questions agents ask</h2>
        <dl className="mt-2 grid gap-3 md:grid-cols-2">
          {FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold">{item.q}</dt>
              <dd className="text-sm text-slate-600">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-500">
          Visibility and the number of requests are not guaranteed.
        </p>
      </section>
    </main>
  );
}
