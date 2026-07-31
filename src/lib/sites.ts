export type Section = {
  heading: string;
  blurb: string;
  /** Godesi feed query for this row. */
  query: Record<string, string>;
  /** Where "see everything" points on godesi.com. */
  moreHref: string;
  moreLabel: string;
};

export type SiteConfig = {
  key: string;
  domain: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  /** Tailwind classes, kept as literals so the compiler keeps them. */
  gradient: string;
  accent: string;
  kind: "news" | "events" | "businesses" | "leads";
  sections: Section[];
  about: string[];
  /** Hero search: shown when the site is a lookup tool rather than a feed. */
  search?: { placeholder: string; suggestions: string[] };
};

const GODESI = process.env.NEXT_PUBLIC_GODESI_URL ?? "https://godesi.com";

/** Godesi event types that belong on a festival site. */
const FESTIVAL_TYPES = [
  "Festival / Mela",
  "Parade / Procession",
  "Dance / Garba / Bhangra",
  "Puja / Satsang / Kirtan",
  "Concert",
  "Music / DJ night",
  "Party",
  "Kids & family",
  "Competition",
];

export function godesiUrl(path = "") {
  return `${GODESI}${path}`;
}

export const SITES: SiteConfig[] = [
  {
    key: "desinewspaper",
    domain: "desinewspaper.com",
    name: "Desi Newspaper",
    tagline: "Desi headlines, filed by the community",
    description:
      "Community, politics, immigration, business and India headlines for desis abroad — reported by readers on Godesi.",
    emoji: "📰",
    gradient: "from-slate-900 via-indigo-900 to-slate-800",
    accent: "text-indigo-600",
    kind: "news",
    sections: [
      {
        heading: "Latest headlines",
        blurb: "Everything filed in the last few days.",
        query: { kind: "news", limit: "18" },
        moreHref: "/news",
        moreLabel: "All news on Godesi",
      },
      {
        heading: "India",
        blurb: "What is happening back home.",
        query: { kind: "news", q: "India", limit: "6" },
        moreHref: "/news",
        moreLabel: "More India news",
      },
      {
        heading: "Visas & immigration",
        blurb: "H-1B, green cards, consulates and travel rules.",
        query: { kind: "news", q: "visa", limit: "6" },
        moreHref: "/news",
        moreLabel: "More immigration news",
      },
      {
        heading: "Faith & festivals",
        blurb: "Temples, gurdwaras, pujas and religious observances.",
        query: { kind: "news", topic: "faith", limit: "6" },
        moreHref: "/news?topic=faith",
        moreLabel: "More faith news",
      },
      {
        heading: "Community events near you",
        blurb: "What the community is gathering for this month.",
        query: { kind: "events", limit: "6" },
        moreHref: "/events",
        moreLabel: "All events on Godesi",
      },
    ],
    about: [
      "Desi Newspaper is the headline window onto Godesi's community newsroom.",
      "Stories are written and verified by Godesi members — local journalists, business owners and readers who were there.",
      "Every headline links to the full report on Godesi, where you can comment, share and file your own.",
    ],
  },
  {
    key: "diwali",
    domain: "diwali.cc",
    name: "Diwali.cc",
    tagline: "Find a Diwali, Navratri or Holi celebration near you",
    description:
      "Festival melas, garba nights, parades, pujas and cultural shows happening near you — listed free on Godesi.",
    emoji: "🪔",
    gradient: "from-amber-500 via-rose-500 to-fuchsia-600",
    accent: "text-rose-600",
    kind: "events",
    sections: [
      {
        heading: "Upcoming festival events",
        blurb: "Melas, garba nights, parades and cultural shows.",
        query: {
          kind: "events",
          type: FESTIVAL_TYPES.join(","),
          limit: "18",
        },
        moreHref: "/events",
        moreLabel: "All events on Godesi",
      },
      {
        heading: "Puja, satsang & kirtan",
        blurb: "Temple programmes and community prayers.",
        query: { kind: "events", type: "Puja / Satsang / Kirtan", limit: "6" },
        moreHref: "/events",
        moreLabel: "More religious events",
      },
      {
        heading: "Everything else coming up",
        blurb: "Concerts, workshops, meetups and community programmes.",
        query: { kind: "events", limit: "6" },
        moreHref: "/events",
        moreLabel: "See the full calendar",
      },
      {
        heading: "Where to shop & cater",
        blurb: "Sweet shops, caterers, decorators and gift stores.",
        query: { kind: "businesses", category: "food-catering", limit: "6" },
        moreHref: "/categories/food-catering",
        moreLabel: "All food & catering",
      },
    ],
    about: [
      "Diwali.cc is a free festival calendar for the desi diaspora, powered by Godesi's community events board.",
      "Organisers list a festival once on Godesi and it shows up here — with photos, venue, timings and tickets.",
      "Running a mela, garba night or parade? Post it free and reach thousands of families.",
    ],
  },
  {
    key: "iba",
    domain: "indianbusinessassociation.com",
    name: "Indian Business Association",
    tagline: "Find, support and grow Indian-owned businesses",
    description:
      "A free directory of Indian and South Asian owned businesses across the USA — restaurants, grocers, realtors, doctors, contractors and professionals.",
    emoji: "🤝",
    gradient: "from-emerald-700 via-teal-700 to-cyan-700",
    accent: "text-emerald-700",
    kind: "businesses",
    sections: [
      {
        heading: "Newest businesses",
        blurb: "Just added to the directory.",
        query: { kind: "businesses", limit: "18" },
        moreHref: "/search",
        moreLabel: "Browse the full directory",
      },
      {
        heading: "Professionals & experts",
        blurb: "Accountants, lawyers, doctors, insurance and consultants.",
        query: { kind: "businesses", category: "professionals", limit: "6" },
        moreHref: "/categories/professionals",
        moreLabel: "All professionals",
      },
      {
        heading: "Real estate & homes",
        blurb: "Agents, mortgage, property management and builders.",
        query: { kind: "businesses", category: "real-estate", limit: "6" },
        moreHref: "/categories/real-estate",
        moreLabel: "All real estate",
      },
      {
        heading: "Business & professional services",
        blurb: "Marketing, IT, staffing, logistics and back office.",
        query: { kind: "businesses", category: "business-services", limit: "6" },
        moreHref: "/categories/business-services",
        moreLabel: "All business services",
      },
    ],
    about: [
      "The Indian Business Association directory exists to make Indian-owned businesses easy to find and easy to support.",
      "Listings come from Godesi's open directory. Owners claim their page free, add photos, hours, WhatsApp and packages.",
      "There is no membership fee to be listed — Godesi charges only for optional featured placement and advertising.",
    ],
  },
  {
    key: "itplacement",
    domain: "itplacement.help",
    name: "IT Placement Help",
    tagline: "IT jobs, bench openings and placement help for desis in the USA",
    description:
      "Search open IT requirements, bench positions and placement support — H-1B, OPT and CPT friendly consultancies listed free on Godesi.",
    emoji: "\u{1F4BB}",
    gradient: "from-sky-700 via-blue-700 to-indigo-800",
    accent: "text-blue-700",
    kind: "leads",
    search: {
      placeholder: "Search a skill, role or city — e.g. Java developer, Dallas",
      suggestions: ["Java", "QA", "Data engineer", "Salesforce", "OPT", "H1B"],
    },
    sections: [
      {
        heading: "Open IT requirements",
        blurb: "Live roles and bench needs posted by employers and consultancies.",
        query: { kind: "leads", category: "jobs,it-training", limit: "18" },
        moreHref: "/leads",
        moreLabel: "All requirements on Godesi",
      },
      {
        heading: "Placement & training help",
        blurb: "OPT/CPT training, interview prep, resume help and placement support.",
        query: { kind: "businesses", category: "it-training", limit: "9" },
        moreHref: "/categories/it-training",
        moreLabel: "All IT training & career services",
      },
      {
        heading: "Immigration & visa news",
        blurb: "H-1B, green card and consulate updates that affect your job.",
        query: { kind: "news", q: "visa", limit: "6" },
        moreHref: "/news",
        moreLabel: "More immigration news",
      },
    ],
    about: [
      "IT Placement Help is the candidate view of Godesi's IT jobs and requirements board.",
      "Requirements are posted by employers, consultancies and recruiters on Godesi; you respond there, free.",
      "Looking for training or placement support? Every consultancy listed here has a free, claimable Godesi page.",
    ],
  },
  {
    key: "itplacementservices",
    domain: "itplacementservices.com",
    name: "IT Placement Services",
    tagline: "Desi IT staffing, consultancies and corporate training",
    description:
      "A free directory of Indian-owned IT staffing firms, consultancies and training institutes in the USA — post a requirement or hotlist and reach candidates.",
    emoji: "\u{1F91D}",
    gradient: "from-slate-800 via-cyan-800 to-teal-700",
    accent: "text-teal-700",
    kind: "businesses",
    search: {
      placeholder: "Search a consultancy, skill or city — e.g. staffing, Edison",
      suggestions: ["Staffing", "Consulting", "Training", "Edison", "Dallas"],
    },
    sections: [
      {
        heading: "IT staffing & consultancies",
        blurb: "Firms that place candidates and run the bench.",
        query: { kind: "businesses", category: "it-training", limit: "18" },
        moreHref: "/categories/it-training",
        moreLabel: "All IT training & career services",
      },
      {
        heading: "Business & professional services",
        blurb: "Payroll, immigration attorneys, accounting and back office.",
        query: { kind: "businesses", category: "business-services", limit: "9" },
        moreHref: "/categories/business-services",
        moreLabel: "All business services",
      },
      {
        heading: "Requirements looking for vendors",
        blurb: "Open needs you can respond to today.",
        query: { kind: "leads", category: "jobs,it-training", limit: "9" },
        moreHref: "/leads",
        moreLabel: "All requirements on Godesi",
      },
    ],
    about: [
      "IT Placement Services lists Indian-owned IT staffing firms, consultancies and training institutes across the USA.",
      "Every listing is a free, claimable Godesi page — add your hotlist, contacts, WhatsApp and photos once and it shows here.",
      "Post a requirement on Godesi and candidates and vendors respond directly; Godesi is not a party to any placement.",
    ],
  },
];

const BY_DOMAIN = new Map(SITES.map((site) => [site.domain, site]));

/** Falls back to the news site for previews and local development. */
export function siteForHost(host?: string | null): SiteConfig {
  const clean = (host ?? "").toLowerCase().split(":")[0].replace(/^www\./, "");
  const direct = BY_DOMAIN.get(clean);
  if (direct) return direct;

  const configured = process.env.NEXT_PUBLIC_SITE?.toLowerCase();
  if (configured) {
    const byDomain = BY_DOMAIN.get(configured.replace(/^www\./, ""));
    if (byDomain) return byDomain;
    const byKey = SITES.find((site) => site.key === configured);
    if (byKey) return byKey;
  }

  return SITES[0];
}
