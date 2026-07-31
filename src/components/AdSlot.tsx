"use client";

import { useEffect } from "react";
import { godesiUrl } from "@/lib/sites";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * AdSense when it is configured and filling, otherwise a house ad pointing at
 * Godesi — the space never sits empty.
 */
export function AdSlot({ accent }: { accent: string }) {
  useEffect(() => {
    if (!CLIENT || !SLOT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // AdSense not loaded (blocked or offline) — the house ad stays visible.
    }
  }, []);

  return (
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {CLIENT && SLOT ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={CLIENT}
          data-ad-slot={SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}

      <a
        href={godesiUrl("/advertise")}
        target="_blank"
        rel="noopener"
        className="block p-4 text-center"
      >
        <p className="text-sm font-bold text-slate-900">
          Advertise to the desi community
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Banners, featured listings and sponsored links across the Godesi
          network.
        </p>
        <span className={`mt-2 inline-block text-xs font-bold ${accent}`}>
          See ad packages →
        </span>
      </a>
    </aside>
  );
}
