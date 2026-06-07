const baseUrl = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const secret = process.env.CMS_SEED_SECRET;

if (!secret) {
  console.error("CMS_SEED_SECRET is required.");
  process.exit(1);
}

const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/cms/seed`, {
  method: "POST",
  headers: {
    "x-cms-seed-secret": secret
  }
});

const text = await response.text();

if (!response.ok) {
  console.error(text);
  process.exit(1);
}

console.log(text);
