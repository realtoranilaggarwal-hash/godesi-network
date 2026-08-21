# Godesi network sites

One Next.js app serving several niche sites off Godesi's public feed:

| Domain | Focus |
| --- | --- |
| desinewspaper.com | Desi news headlines by topic |
| diwali.cc | Festival events and celebration guides |
| indianbusinessassociation.com | Indian-owned business directory |
| eventringer.com | Full event pages, hosted here for SEO |

Most cards are teasers that link to the full story or listing on godesi.com, so
the sites complement Godesi instead of duplicating it.

## Sites that host their own pages (`eventPages`)

A teaser-only satellite ranks for nothing: the reader lands on godesi.com, so
that is the page Google indexes. A site with `eventPages: true` in
`src/lib/sites.ts` instead publishes the event itself:

- `/events/[slug]` — the whole event (schedule, line-up, venue, ticket tiers,
  generated summary and FAQ) with a **self-referencing canonical**, Event,
  FAQPage and BreadcrumbList JSON-LD.
- `/events`, `/events/in/[city]`, `/events/type/[type]` — indexable hubs that
  internally link every event page.
- `sitemap.xml` lists every event, city and type URL.
- Ticket buttons deep-link to the event on godesi.com with `?ref=eventringer`,
  so booking, payment and entry passes stay on Godesi.

Data comes from Godesi's `/api/events` and `/api/events/[slug]`, which return
the full record (unlike `/api/feed`, which returns teasers).

## Run locally

```bash
npm install
NEXT_PUBLIC_SITE=desinewspaper.com npm run dev   # http://localhost:3100
```

`NEXT_PUBLIC_SITE` only matters locally — in production the site is picked
from the request's `Host` header, so all domains point at one Vercel
project.

## Deploy

1. Create a Vercel project from this repo (root directory).
2. Add every domain in `src/lib/sites.ts` (including eventringer.com) to that project.
3. Env: `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT` for ads.
3. Optional env: `NEXT_PUBLIC_GODESI_URL` (defaults to `https://godesi.com`).
