import { godesiUrl } from "./sites";

/** A published GoDesi Elite profile, from Godesi's /api/elite/[slug]. */
export type EliteProfile = {
  slug: string;
  fullName: string;
  businessName: string | null;
  category: string;
  city: string;
  state: string | null;
  country: string | null;
  shortBio: string;
  achievements: string | null;
  yearsExperience: number | null;
  websiteUrl: string | null;
  socialLinks: string[];
  photoUrl: string | null;
  photoCredit: string | null;
  videoUrl: string | null;
  badge: string;
  awards: string[];
  awardTitle: string | null;
  awardYear: number | null;
  sourceUrl: string | null;
  sourceName: string | null;
  claimed: boolean;
  publishedAt: string | null;
  updatedAt: string;
  url: string;
  claimUrl: string;
};

export async function fetchEliteProfile(slug: string) {
  try {
    const response = await fetch(
      godesiUrl(`/api/elite/${encodeURIComponent(slug)}?ref=desiwhoswho`),
      { next: { revalidate: 600 } },
    );
    if (!response.ok) return null;
    return (await response.json()) as EliteProfile | null;
  } catch {
    return null;
  }
}
