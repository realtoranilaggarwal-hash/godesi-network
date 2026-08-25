/**
 * Organiser-supplied links are rendered as anchors, so only http(s) is allowed
 * through — never javascript: or data:.
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
