export function slugify(input, fallback = "deck-gnosis") {
  const slug = String(input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
  return slug || fallback;
}

export function uniqueSlug(base, used) {
  const clean = slugify(base, "fiche");
  let candidate = clean;
  let index = 2;
  while (used.has(candidate)) {
    const suffix = `-${index}`;
    candidate = `${clean.slice(0, 80 - suffix.length)}${suffix}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

export function compactTopics(topics, maxTopics) {
  return [...new Set((topics ?? []).map((topic) => String(topic).trim()).filter(Boolean))].slice(
    0,
    maxTopics,
  );
}

export function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

