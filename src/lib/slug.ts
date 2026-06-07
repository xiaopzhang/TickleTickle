export function slugifyText(input: string | undefined, fallback = "item", maxLength = 120) {
  const slug = (input || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");

  return slug || fallback;
}
