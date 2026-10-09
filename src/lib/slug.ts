/** "Eggholic Jersey City" -> "eggholic-jersey-city" */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "restaurant";
}

/** Unique slug: base + 4 random chars, e.g. "eggholic-jc-a1b2" */
export function makeSlug(name: string): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `${slugify(name)}-${rand}`;
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
