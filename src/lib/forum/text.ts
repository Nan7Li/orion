const TOKEN = /([#@][\p{L}\p{N}_]+)/gu;

export type BodyPart =
  | { type: "text"; value: string }
  | { type: "tag"; value: string }
  | { type: "mention"; value: string };

export function parseBody(body: string): BodyPart[] {
  const parts: BodyPart[] = [];
  let last = 0;
  const re = new RegExp(TOKEN);
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    if (m.index > last) parts.push({ type: "text", value: body.slice(last, m.index) });
    const raw = m[0];
    if (raw.startsWith("#")) parts.push({ type: "tag", value: raw.slice(1) });
    else parts.push({ type: "mention", value: raw.slice(1) });
    last = m.index + raw.length;
  }
  if (last < body.length) parts.push({ type: "text", value: body.slice(last) });
  return parts;
}

export function extractTags(body: string): string[] {
  const tags = new Set<string>();
  for (const part of parseBody(body)) {
    if (part.type === "tag") tags.add(part.value);
  }
  return [...tags];
}

export const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

export function normalizeHandle(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@/, "");
}

export function handleFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "user";
  const cleaned = local.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16);
  return cleaned.length >= 3 ? cleaned : `orion${Math.floor(Math.random() * 900 + 100)}`;
}
