import { godesiUrl } from "./sites";

export type ChatterAuthor = {
  name: string;
  username: string | null;
  avatarUrl: string | null;
  url: string | null;
};

export type ChatterItem = {
  id: string;
  body: string;
  imageUrl: string | null;
  topic: { id: string; label: string; emoji: string };
  city: string | null;
  language: string;
  tags: string[];
  parentId: string | null;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  editedAt: string | null;
  author: ChatterAuthor;
  url: string;
};

export type ChatterTopic = { id: string; label: string; emoji: string };

export type ChatterFeed = {
  items: ChatterItem[];
  nextBefore: string | null;
  trending: { tag: string; count: number }[];
  topics: ChatterTopic[];
};

export type ChatterThread = {
  post: ChatterItem;
  parent: { id: string; author: string; url: string } | null;
  replies: ChatterItem[];
};

const EMPTY: ChatterFeed = { items: [], nextBefore: null, trending: [], topics: [] };

/** New posts reach Gapodi within two minutes; nothing on the page polls. */
const REVALIDATE = 120;

export async function fetchChatter(
  query: { topic?: string; city?: string; tag?: string; before?: string } = {},
): Promise<ChatterFeed> {
  const params = new URLSearchParams({ ref: "gapodi" });
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  try {
    const response = await fetch(godesiUrl(`/api/chatter?${params}`), {
      next: { revalidate: REVALIDATE },
    });
    if (!response.ok) return EMPTY;
    return (await response.json()) as ChatterFeed;
  } catch {
    return EMPTY;
  }
}

export async function fetchChatterThread(id: string): Promise<ChatterThread | null> {
  try {
    const response = await fetch(
      godesiUrl(`/api/chatter/${encodeURIComponent(id)}?ref=gapodi`),
      { next: { revalidate: REVALIDATE } },
    );
    if (!response.ok) return null;
    return (await response.json()) as ChatterThread;
  } catch {
    return null;
  }
}

/** Where every write action goes: Chatter on godesi.com, signed in there. */
export const CHATTER_HOME = godesiUrl("/chatter?ref=gapodi");
export const GAPODI_SIGNUP = godesiUrl("/signup?next=%2Fchatter&ref=gapodi");

/** Only http(s) links from the feed are rendered; anything else falls back to Chatter. */
export function safeHref(url: string | null | undefined) {
  return url && /^https?:\/\//i.test(url) ? url : CHATTER_HOME;
}

export function excerpt(body: string, length = 70) {
  const flat = body.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length - 1)}…` : flat;
}

/** "5m", "3h", "2d", then a short date. */
export function age(iso: string, now = Date.now()) {
  const date = new Date(iso);
  const minutes = Math.max(0, Math.floor((now - date.getTime()) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export type BodyPart =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: string }
  | { kind: "tag"; text: string; tag: string };

/** Plain text, http(s) links and #words, for rendering a post body. */
export function bodyParts(body: string): BodyPart[] {
  const parts: BodyPart[] = [];
  const token = new RegExp(
    String.raw`(https?:\/\/[^\s<>"]+)|(^|[^\p{L}\p{N}_&])#([\p{L}\p{N}_]{2,40})`,
    "gu",
  );
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(body))) {
    if (match[1]) {
      const href = match[1].replace(/[.,!?;:)]+$/, "");
      if (match.index > last) parts.push({ kind: "text", text: body.slice(last, match.index) });
      parts.push({ kind: "link", text: href.replace(/^https?:\/\//, ""), href });
      last = match.index + href.length;
      token.lastIndex = last;
    } else {
      const start = match.index + match[2].length;
      if (start > last) parts.push({ kind: "text", text: body.slice(last, start) });
      parts.push({ kind: "tag", text: `#${match[3]}`, tag: match[3].toLowerCase() });
      last = start + match[3].length + 1;
    }
  }
  if (last < body.length) parts.push({ kind: "text", text: body.slice(last) });
  return parts;
}

export function tagPath(tag: string) {
  return `/tag/${encodeURIComponent(tag.toLowerCase())}`;
}
