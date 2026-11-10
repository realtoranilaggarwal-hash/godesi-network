import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { eventShortCode, fetchEvents } from "@/lib/events";
import { siteForHost } from "@/lib/sites";

/** Short event links: eve0.com/nye2027 or eve0.com/<5-character code>. */
export default async function ShortLink({
  params,
}: {
  params: { code: string };
}) {
  const site = siteForHost(headers().get("host"));
  const code = decodeURIComponent(params.code).toLowerCase();
  if (!site.compact || !/^[a-z0-9-]{2,40}$/.test(code)) notFound();

  const named = site.shortLinks?.[code];
  if (named) redirect(`/events/${named}`);

  const { items } = await fetchEvents({ limit: "200" });
  const match = items.find((event) => eventShortCode(event.slug) === code);
  if (!match) notFound();
  redirect(`/events/${match.slug}`);
}
