"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const FEED_URL = "https://godesi.com/api/banners/network";
const DEFAULT_BOOK_URL = "https://godesi.com/advertise?slot=MOBILE#book";
const WIDTH = 320;
const HEIGHT = 100;

// Logged-in areas, checkout and printable pages stay ad-free.
const AD_FREE =
  /^\/(admin|app|dashboard|account|login|signup|register|checkout|orders|check-in|tenant|maintainer|members|messages|ebook|print|embed|cover)(\/|$)/;

type Banner = { id: string; title: string; image: string; click: string };
type Feed = {
  price: string;
  bookUrl: string;
  impressionUrl: string;
  banners: Banner[];
};

function withRef(url: string, source: string) {
  const target = new URL(url);
  target.searchParams.set("ref", source);
  return target.toString();
}

function pick(banners: Banner[], count: number) {
  const pool = [...banners];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * GoDesi Small banners (320x100) in the footer area. Booked on godesi.com, a
 * Small banner also shows on these sites. Nothing loads until the row scrolls
 * into view, so bots and quick visits cost nothing, and each banner seen counts
 * one view. Empty spots invite the visitor to book one.
 */
export function GoDesiBanners({ source, count = 3 }: { source: string; count?: number }) {
  const pathname = usePathname() ?? "/";
  const box = useRef<HTMLElement>(null);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [shown, setShown] = useState<Banner[]>([]);
  const hidden = AD_FREE.test(pathname);

  useEffect(() => {
    const node = box.current;
    if (hidden || !node || typeof IntersectionObserver === "undefined") return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fetch(FEED_URL)
          .then((response) => (response.ok ? response.json() : null))
          .then((data: Feed | null) => {
            if (cancelled || !data || !Array.isArray(data.banners)) return;
            const chosen = pick(data.banners, count);
            setFeed(data);
            setShown(chosen);
            for (const banner of chosen) {
              navigator.sendBeacon?.(
                data.impressionUrl,
                new Blob([JSON.stringify({ id: banner.id })], { type: "text/plain" }),
              );
            }
          })
          .catch(() => undefined);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [hidden, count, pathname]);

  if (hidden) return null;

  const bookUrl = withRef(feed?.bookUrl ?? DEFAULT_BOOK_URL, source);
  const price = feed?.price ?? "$24/mo";
  const slots = Array.from({ length: count }, (_, i) => shown[i] ?? null);

  return (
    <section
      ref={box}
      data-godesi-banners=""
      aria-label="Sponsored"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", fontFamily: "inherit" }}
    >
      <style>{"@media print{[data-godesi-banners]{display:none!important}}"}</style>
      <p
        style={{
          margin: "0 0 8px",
          textAlign: "center",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#94a3b8",
        }}
      >
        Sponsored · Ads by GoDesi.com
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {slots.map((banner, i) => (
          <div key={banner?.id ?? `open-${i}`} style={{ width: WIDTH, maxWidth: "100%" }}>
            {banner ? (
              <a
                href={banner.click}
                target="_blank"
                rel="sponsored noopener"
                title={banner.title}
                style={{ display: "block", lineHeight: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  width={WIDTH}
                  height={HEIGHT}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: `${WIDTH} / ${HEIGHT}`,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                />
              </a>
            ) : (
              <a
                href={bookUrl}
                target="_blank"
                rel="nofollow noopener"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  aspectRatio: `${WIDTH} / ${HEIGHT}`,
                  borderRadius: 8,
                  border: "2px dashed #fdba74",
                  background: "linear-gradient(135deg,#fff7ed,#ffffff 50%,#eff6ff)",
                  color: "#1e3a8a",
                  textDecoration: "none",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 800, color: "#ea580c" }}>Your ad here</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  Seen on GoDesi.com + 25 more sites
                </span>
              </a>
            )}
            <a
              href={bookUrl}
              target="_blank"
              rel="nofollow noopener"
              style={{
                display: "block",
                marginTop: 4,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              Book this spot — {price}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
