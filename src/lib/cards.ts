import { godesiUrl } from "@/lib/sites";

/** One GoDesi card's public fields, from godesi.com's /api/card/[slug]. */
export type MiniCard = {
  slug: string;
  name: string;
  profileType: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address: string | null;
  categorySlug: string | null;
  subcategory: string | null;
  services: string[];
  yearsExperience: number | null;
  verified: boolean;
  claimed: boolean;
  featured: boolean;
  websiteUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  googleReviewUrl: string | null;
  mapsUrl: string | null;
  priceFrom: number | null;
  priceCurrency: string | null;
  shortUrl: string;
  url: string;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
};

export async function fetchCard(slug: string): Promise<MiniCard | null> {
  try {
    const response = await fetch(
      godesiUrl(`/api/card/${encodeURIComponent(slug)}`),
      { next: { revalidate: 600 } },
    );
    if (!response.ok) return null;
    return (await response.json()) as MiniCard;
  } catch {
    return null;
  }
}
