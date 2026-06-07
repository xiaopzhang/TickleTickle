# TickleTickle

TickleTickle is a bilingual main site for Youdu's indie products, useful tools, build-in-public notes, and AdSense-ready trust pages.

## Local Development

```bash
npm install
npm run dev
```

Open:

- Public English site: `http://localhost:3000/en`
- Public Chinese site: `http://localhost:3000/zh`
- Payload CMS admin: `http://localhost:3000/admin`

## Required Environment Variables

Create `.env.local` before using the CMS. For production, set `NEXT_PUBLIC_SITE_URL` to `https://tickletickle.space`.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE
PAYLOAD_SECRET=replace-with-a-long-random-secret
DEEPSEEK_API_KEY=sk-your-deepseek-key
TRANSLATION_ROUTE_SECRET=replace-with-a-route-secret
CMS_SEED_SECRET=replace-with-a-seed-secret
ADSENSE_PUBLISHER_ID=
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Without `DATABASE_URL` and `PAYLOAD_SECRET`, `/admin` shows a setup screen and Payload API routes return `503`.

## Useful Commands

```bash
npm run lint
npm run build
npm run payload:types
npm run payload:importmap
npm run cms:seed
npm run cms:translate-post -- why-tickletickle-exists
```

## Production CMS Setup

Use a managed Postgres database for production. On Vercel, the simplest path is a Marketplace Postgres provider such as Neon or Supabase.

1. Link the project with Vercel.
2. Add a Postgres integration from the Vercel Marketplace.
3. Make sure these environment variables exist in Vercel Production and Preview:
   - `NEXT_PUBLIC_SITE_URL=https://tickletickle.space`
   - `DATABASE_URL`
   - `PAYLOAD_SECRET`
   - `DEEPSEEK_API_KEY`
   - `TRANSLATION_ROUTE_SECRET`
   - `CMS_SEED_SECRET`
   - `ADSENSE_PUBLISHER_ID` after AdSense provides it
   - `GOOGLE_SITE_VERIFICATION` after Google Search Console provides the HTML tag verification token
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` after Google Analytics provides a GA4 measurement ID
4. Deploy the site.
5. Open `/admin` and create the first admin user.
6. Seed starter CMS content:

```bash
CMS_BASE_URL=https://tickletickle.space CMS_SEED_SECRET=... npm run cms:seed
```

Translate a Chinese post into an English draft:

```bash
CMS_BASE_URL=https://tickletickle.space TRANSLATION_ROUTE_SECRET=... npm run cms:translate-post -- why-tickletickle-exists
```

The seed and translation endpoints are protected by secrets and return `401` without the matching header.

## AdSense Readiness

The public site includes:

- About, Contact, Privacy Policy, Terms, Cookie Policy, and Editorial Policy
- `/robots.txt`
- `/sitemap.xml`
- `/ads.txt`
- canonical and alternate language metadata
- bilingual `/en` and `/zh` page paths

Set `ADSENSE_PUBLISHER_ID` after Google provides the publisher ID, for example `pub-1234567890123456`.

## Google Search Console

Use the HTML tag verification option. Add only the `content` value from Google's tag as `GOOGLE_SITE_VERIFICATION`, then redeploy.

For example, if Google provides:

```html
<meta name="google-site-verification" content="abc123" />
```

set:

```bash
GOOGLE_SITE_VERIFICATION=abc123
```

After verification, submit `https://tickletickle.space/sitemap.xml` in Search Console.

## Google Analytics

Create a GA4 web data stream and add its measurement ID as `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

For example:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The Google Analytics script only loads when this value is set.

## Known Audit Notes

`npm audit` currently reports remaining moderate advisories from upstream dependencies:

- `next` bundles a vulnerable `postcss` range according to npm audit. The suggested force fix downgrades Next to an old major version, so it should not be applied.
- `@payloadcms/db-postgres` depends on `drizzle-kit`, which depends on an older `esbuild` path with no npm audit fix available.

The direct `dompurify` issue is pinned through npm `overrides` to `3.4.7`.
