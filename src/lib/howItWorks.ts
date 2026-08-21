import { godesiUrl } from "@/lib/sites";

/** Mirrors `howItWorks()` in the godesi repo, served at /api/events/how-it-works. */
export type HowItWorks = {
  tagline: string;
  blurb: string;
  postUrl: string;
  guideUrl: string;
  posterUrl: string;
  posterShareUrl: string;
  eventTypeCount: number;
  featureCount: number;
  steps: { title: string; body: string }[];
  plans: {
    id: string;
    name: string;
    priceUsd: number;
    priceInr: number;
    blurb: string;
    note: string;
  }[];
  fees: { label: string; value: string }[];
  ads: {
    name: string;
    priceUsd: number;
    priceInr: number;
    blurb: string;
  }[];
  published: { where: string; body: string }[];
  reasons: string[];
};

/**
 * Pulled rather than copied: the plan prices, ticket fee and ad rates live in
 * the Godesi codebase, so this page cannot quote a stale number.
 */
export async function fetchHowItWorks(): Promise<HowItWorks | null> {
  try {
    const response = await fetch(godesiUrl("/api/events/how-it-works"), {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return (await response.json()) as HowItWorks;
  } catch {
    return null;
  }
}

export function money(usd: number, inr: number) {
  if (!usd && !inr) return "Free";
  return `$${usd} / ₹${inr.toLocaleString("en-IN")}`;
}
