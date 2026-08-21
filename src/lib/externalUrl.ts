/**
 * Organiser-supplied links (venue map, promo video, business site) arrive from
 * the Godesi feed, so a `javascript:` value would run on click. Only http(s)
 * survives; anything else is dropped and the link is not rendered.
 */
export function externalUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
