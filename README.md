# Godesi network sites

One Next.js app serving three niche sites off Godesi's public feed:

| Domain | Focus |
| --- | --- |
| desinewspaper.com | Desi news headlines by topic |
| diwali.cc | Festival events and celebration guides |
| indianbusinessassociation.com | Indian-owned business directory |

Every card is a teaser that links to the full story or listing on
godesi.com, so the sites complement Godesi instead of duplicating it.

## Run locally

```bash
npm install
NEXT_PUBLIC_SITE=desinewspaper.com npm run dev   # http://localhost:3100
```

`NEXT_PUBLIC_SITE` only matters locally — in production the site is picked
from the request's `Host` header, so all three domains point at one Vercel
project.

## Deploy

1. Create a Vercel project from this repo (root directory).
2. Add the three domains to that project.
3. Env: `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT` for ads.
3. Optional env: `NEXT_PUBLIC_GODESI_URL` (defaults to `https://godesi.com`).
