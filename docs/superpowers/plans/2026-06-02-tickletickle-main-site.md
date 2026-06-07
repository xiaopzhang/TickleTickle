# TickleTickle Main Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready TickleTickle main site for showcasing two websites, publishing bilingual short posts, and preparing for Google AdSense review.

**Architecture:** Use a Next.js App Router frontend with local seed content first, then add Payload CMS collections and DeepSeek translation hooks once the public site shell is stable. Public routes use `/zh` and `/en`, share typed content helpers, and generate SEO metadata, sitemap, robots, and compliance pages from structured data.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Payload CMS, PostgreSQL, DeepSeek API, Vercel.

---

### Task 1: Scaffold The Next.js Site

**Files:**
- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Scaffold Next.js**

Run:

```bash
npx create-next-app@latest . --yes --force --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

Expected: a Next.js App Router project exists in the current directory.

- [ ] **Step 2: Run the initial build**

Run:

```bash
npm run build
```

Expected: build succeeds with the generated starter app.

### Task 2: Add Core Content Data

**Files:**
- Create: `src/content/site.ts`
- Create: `src/content/sites.ts`
- Create: `src/content/posts.ts`
- Create: `src/content/pages.ts`
- Create: `src/lib/content.ts`

- [ ] **Step 1: Add typed local content**

Create structured content for:

```ts
export type Locale = "en" | "zh";
export type LocalizedText = Record<Locale, string>;
export type LocalizedRichText = Record<Locale, string[]>;
```

Expected: content includes TickleTickle brand copy, two site records, three starter blog posts, and compliance page copy for privacy, terms, cookies, editorial policy, about, and contact.

- [ ] **Step 2: Add content lookup helpers**

Create helpers:

```ts
export function getSites(locale: Locale): SiteSummary[];
export function getSiteBySlug(slug: string, locale: Locale): SiteDetail | undefined;
export function getPosts(locale: Locale): PostSummary[];
export function getPostBySlug(slug: string, locale: Locale): PostDetail | undefined;
export function getPage(slug: string, locale: Locale): PageDetail | undefined;
```

Expected: all public routes can read content without direct imports from multiple content files.

### Task 3: Build Public Routes

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/sites/page.tsx`
- Create: `src/app/[locale]/sites/[slug]/page.tsx`
- Create: `src/app/[locale]/blog/page.tsx`
- Create: `src/app/[locale]/blog/[slug]/page.tsx`
- Create: `src/app/[locale]/[pageSlug]/page.tsx`
- Create: `src/components/header.tsx`
- Create: `src/components/footer.tsx`
- Create: `src/components/site-card.tsx`
- Create: `src/components/post-card.tsx`
- Create: `src/components/language-switch.tsx`
- Create: `src/components/preview-window.tsx`

- [ ] **Step 1: Add locale layout**

Expected: `/zh` and `/en` render with localized navigation and valid HTML `lang`.

- [ ] **Step 2: Implement the homepage**

Expected: homepage includes TickleTickle hero, two featured site cards, latest notes, trust/compliance block, and footer links.

- [ ] **Step 3: Implement list and detail pages**

Expected: sites and blog have index pages and detail pages, and missing slugs return `notFound()`.

- [ ] **Step 4: Implement fixed pages**

Expected: about, contact, privacy-policy, terms, cookie-policy, and editorial-policy render in both languages.

### Task 4: Add SEO And AdSense Readiness

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/sites/[slug]/page.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/ads.txt/route.ts`
- Create: `src/app/not-found.tsx`
- Create: `src/lib/seo.ts`

- [ ] **Step 1: Add metadata helpers**

Expected: pages can generate title, description, canonical URL, and alternate language URLs.

- [ ] **Step 2: Add robots and sitemap**

Expected: `/robots.txt` and `/sitemap.xml` include the public localized pages.

- [ ] **Step 3: Add ads.txt placeholder**

Expected: `/ads.txt` returns a clear placeholder comment until the AdSense publisher ID is available.

- [ ] **Step 4: Add a useful 404 page**

Expected: unknown routes show a TickleTickle branded 404 with links back to sites and blog.

### Task 5: Prepare Payload CMS And DeepSeek Integration

**Files:**
- Create: `payload.config.ts`
- Create: `src/payload/collections/Sites.ts`
- Create: `src/payload/collections/Posts.ts`
- Create: `src/payload/collections/Pages.ts`
- Create: `src/payload/collections/Media.ts`
- Create: `src/payload/globals/Settings.ts`
- Create: `src/lib/deepseek.ts`
- Create: `src/app/api/translate/route.ts`
- Create: `.env.example`

- [ ] **Step 1: Install Payload dependencies**

Run:

```bash
npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp
```

Expected: dependencies install and TypeScript can import Payload modules.

- [ ] **Step 2: Add CMS collections**

Expected: collections represent Sites, Posts, Pages, Media, and Settings with localized fields.

- [ ] **Step 3: Add DeepSeek client**

Expected: `translateToEnglish` accepts Chinese title, excerpt, body, and SEO fields, then returns an English draft payload.

- [ ] **Step 4: Add protected translation route**

Expected: route requires a server-side secret and refuses requests when `DEEPSEEK_API_KEY` is missing.

### Task 6: Verify

**Files:**
- Modify: files touched by previous tasks as needed.

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: no lint errors.

- [ ] **Step 2: Run build**

Run:

```bash
npm run build
```

Expected: production build succeeds.

- [ ] **Step 3: Run local preview**

Run:

```bash
npm run dev
```

Expected: local site renders `/en`, `/zh`, `/en/sites`, `/zh/blog`, `/en/privacy-policy`, `/robots.txt`, `/sitemap.xml`, and `/ads.txt`.

