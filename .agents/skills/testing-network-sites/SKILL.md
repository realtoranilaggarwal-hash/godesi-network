---
name: testing-network-sites
description: How to run and test the godesi-network multi-tenant sites (eventringer.com, desinewspaper.com, ...) locally against the godesi app's public APIs, including host gating, event pages, sitemaps and JSON-LD checks.
---

# Testing godesi-network sites locally

## Which site you get
`src/lib/sites.ts` resolves the tenant from (1) the request `Host` header, then (2) `NEXT_PUBLIC_SITE`,
then (3) the first configured site. So one dev server = one tenant unless you send `Host:` headers.
Run **one dev server per tenant** on different ports instead of switching `Host` headers — mixing hosts
against a single server has been observed to return stale/incorrect 404s for host-gated routes until
the server is restarted (route/data caching). If a host-gated route unexpectedly 404s, restart the server.

Typical setup:

```bash
# tenant under test (event pages enabled)
cd ~/repos/godesi-network
NEXT_PUBLIC_SITE=eventringer.com NEXT_PUBLIC_GODESI_URL=http://localhost:3000 npm run dev -- -p 3100
# a non-event tenant, for host-gating + regression checks
NEXT_PUBLIC_SITE=desinewspaper.com npm run dev -- -p 3101
```

`NEXT_PUBLIC_GODESI_URL` defaults to https://godesi.com; point it at a local godesi app whenever the
API you need is not deployed yet. Data fetches use `next: { revalidate: 600 }`, so restart the network
app (or wait) after changing seed data.

## Running the godesi API locally with test data
Don't write to the production DB. Run a throwaway Postgres and seed it:

```bash
docker run -d --name godesi-pg -e POSTGRES_USER=godesi -e POSTGRES_PASSWORD=godesi \
  -e POSTGRES_DB=godesi -p 5433:5432 postgres:16
cd ~/repos/godesi
DATABASE_URL="postgresql://godesi:godesi@localhost:5433/godesi" npx prisma db push
# NOTE: a bare `tsx`/`node` process does NOT load .env.local — pass DATABASE_URL explicitly:
DATABASE_URL="postgresql://godesi:godesi@localhost:5433/godesi" npx tsx scripts/tmp-seed-events.ts
DATABASE_URL=... NEXT_PUBLIC_SITE_URL=https://godesi.com npm run dev -- -p 3000
```

Set `NEXT_PUBLIC_SITE_URL=https://godesi.com` so outbound ticket/canonical URLs are production-shaped
(`https://godesi.com/events/<slug>?ref=<site>`) and easy to assert on.

Seed fixtures that expose real bugs: an event with tiers + sessions + speakers + features, a free
event, an ONLINE event (VirtualLocation / non-USD currency), a city containing `&` or punctuation
(slug helpers), a PAST event and a non-APPROVED event (must not be listed).

## Checks worth repeating
- Host gating: event routes must 404 on tenants without `eventPages`; their `/sitemap.xml` has only home+about.
- Cards on hubs/search must link to internal `/events/<slug>`; only the ticket CTA may leave the site.
- Canonical must be self-referencing (`https://<tenant>/events/<slug>`), not godesi.com.
- JSON-LD: the page emits several `application/ld+json` blocks (layout WebSite + the page graph).
  Parse them all and pick the one containing `@graph`; assert `Event`/`FAQPage`/`BreadcrumbList`,
  offers price/currency/availability/url, `Place` vs `VirtualLocation`. `grep -c` is useless here
  (HTML is one line) — parse with python.
- Breadcrumb/city links must equal the URL the city route actually serves (`cityPath()`/`slugify()`),
  verify by fetching that path and expecting 200.
- API hardening: `?limit=-5`, `limit=0`, `limit=abc`, `limit=999` should all return sane, ascending pages.
- List filters and detail routes can disagree: `/api/events` filters `startsAt >= now`, while
  `/api/events/[slug]` filters only `status: APPROVED`, so expired events still serve full,
  self-canonical pages whose city hub link 404s. Always test a past event explicitly.

## Devin Secrets Needed
None for local testing (local Postgres + local dev servers only).
