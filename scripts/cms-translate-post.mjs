const baseUrl = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const secret = process.env.TRANSLATION_ROUTE_SECRET;
const slug = process.argv[2];

if (!secret) {
  console.error("TRANSLATION_ROUTE_SECRET is required.");
  process.exit(1);
}

if (!slug) {
  console.error("Usage: npm run cms:translate-post -- <chinese-post-slug>");
  process.exit(1);
}

const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/cms/translate-post`, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-translation-secret": secret
  },
  body: JSON.stringify({ slug })
});

const text = await response.text();

if (!response.ok) {
  console.error(text);
  process.exit(1);
}

console.log(text);
