"use server";

import { headers } from "next/headers";
import { godesiUrl, siteForHost } from "@/lib/sites";

export type AgentRequestState = { ok?: boolean; error?: string };

const FAILED = "Couldn't send your request. Please try again in a minute.";

/** Sends a Compare agents request to GoDesi server-to-server, so the visitor stays on this site. */
export async function sendAgentRequest(
  _prev: AgentRequestState,
  formData: FormData,
): Promise<AgentRequestState> {
  // Bots fill the hidden "website" field; pretend success and drop it.
  if (String(formData.get("website") ?? "")) return { ok: true };
  if (formData.get("consent") !== "on") {
    return { error: "Tick the box so local agents may contact you." };
  }
  const key = process.env.PARTNER_LEAD_KEY;
  if (!key) return { error: FAILED };

  const site = siteForHost(headers().get("host"));
  const field = (name: string) => String(formData.get(name) ?? "").trim();
  try {
    const response = await fetch(godesiUrl("/api/partner-leads"), {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json", "x-partner-key": key },
      body: JSON.stringify({
        site: site.domain,
        intent: field("do") === "sell" ? "sell" : "buy",
        city: field("city"),
        name: field("name"),
        phone: field("phone"),
        email: field("email"),
        message: field("message"),
      }),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      return { error: response.status === 400 && data?.error ? data.error : FAILED };
    }
  } catch {
    return { error: FAILED };
  }
  return { ok: true };
}
