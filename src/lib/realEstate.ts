import { godesiUrl } from "./sites";

export type Agent = {
  slug: string;
  name: string;
  kind: "agent" | "brokerage";
  city: string;
  state: string | null;
  country: string | null;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  whatsappNumber: string | null;
  phone: string | null;
  email: string | null;
  zillowUrl: string | null;
  realtorUrl: string | null;
  homesUrl?: string | null;
  specialties: string[];
  certifications: string[];
  licenseNumber: string | null;
  yearsExperience: number | null;
  claimed: boolean;
  verified: boolean;
  featured: boolean;
  updatedAt: string;
  godesiUrl: string;
};

export type Property = {
  slug: string;
  kind: "sale" | "rent";
  title: string;
  description: string;
  city: string;
  area: string | null;
  state: string | null;
  country: string | null;
  price: number;
  currency: string;
  perMonth: boolean;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  builtUpArea: number | null;
  images: string[];
  createdAt: string;
  godesiUrl: string;
};

export type AgentCity = { city: string; state: string | null; count: number };

const REVALIDATE = 600;
const REF = "realestateyp";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(godesiUrl(path), {
      next: { revalidate: REVALIDATE },
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function fetchAgents(query: Record<string, string> = {}) {
  const params = new URLSearchParams({ ref: REF, ...query });
  return getJson<{ total: number; items: Agent[]; cities?: AgentCity[] }>(
    `/api/real-estate/agents?${params}`,
    { total: 0, items: [] },
  );
}

export function fetchAgent(slug: string) {
  return getJson<Agent | null>(
    `/api/real-estate/agents/${encodeURIComponent(slug)}?ref=${REF}`,
    null,
  );
}

export function fetchProperties(query: Record<string, string> = {}) {
  const params = new URLSearchParams({ ref: REF, ...query });
  return getJson<{ total: number; items: Property[] }>(
    `/api/real-estate/properties?${params}`,
    { total: 0, items: [] },
  );
}

/** Sign-up that lands straight on a new real estate agent card on Godesi. */
export const AGENT_SIGNUP =
  "/signup?next=%2Fdashboard%2Fprofile%3Fcategory%3Dreal-estate%26subcategory%3Dreal-estate-property-dealers%26type%3Dprofessional";

export function agentPlace(agent: Pick<Agent, "city" | "state">) {
  return [agent.city, agent.state].filter(Boolean).join(", ");
}

export function formatPrice(property: Property) {
  if (!property.price) return "Price on request";
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: property.currency || "USD",
    maximumFractionDigits: 0,
  }).format(property.price);
  return property.perMonth ? `${amount}/month` : amount;
}
