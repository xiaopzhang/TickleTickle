import {
  getPage,
  getPostBySlug,
  getPosts,
  getSiteBySlug,
  getSites
} from "@/lib/content";
import { hasPayloadEnv } from "@/lib/payload-env";
import { lexicalToParagraphs } from "@/lib/lexical";
import type { Locale } from "@/lib/i18n";
import type { Payload } from "payload";

let payloadClientPromise: Promise<Payload | null> | null = null;

async function createPayloadClient() {
  if (!hasPayloadEnv()) return null;

  try {
    const [{ getPayload }, configModule] = await Promise.all([
      import("payload"),
      import("../../payload.config.ts")
    ]);

    return getPayload({ config: configModule.default });
  } catch (error) {
    console.error("Failed to initialize Payload content source", error);
    return null;
  }
}

function getPayloadClient() {
  payloadClientPromise ??= createPayloadClient();
  return payloadClientPromise;
}

function withCmsTimeout<T>(promise: Promise<T>, label: string, timeoutMs = 20000) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    })
  ]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown) {
  const stringValue = asString(value).trim();
  return stringValue || undefined;
}

function asAccent(value: unknown): "green" | "blue" {
  return value === "blue" ? "blue" : "green";
}

function withStaticSiteSeo(locale: Locale) {
  return getSites(locale).map((site) => ({
    ...site,
    seoTitle: site.name,
    seoDescription: site.summary,
    createdAt: undefined,
    updatedAt: undefined
  }));
}

function withStaticSiteDetailSeo(slug: string, locale: Locale) {
  const site = getSiteBySlug(slug, locale);
  return site
    ? {
        ...site,
        seoTitle: site.name,
        seoDescription: site.summary,
        createdAt: undefined,
        updatedAt: undefined
      }
    : undefined;
}

function withStaticPostSeo(locale: Locale) {
  return getPosts(locale).map((post) => ({
    ...post,
    createdAt: post.publishedAt,
    seoDescription: post.excerpt,
    seoTitle: post.title,
    updatedAt: post.publishedAt
  }));
}

function withStaticPostDetailSeo(slug: string, locale: Locale) {
  const post = getPostBySlug(slug, locale);
  return post
    ? {
        ...post,
        createdAt: post.publishedAt,
        seoDescription: post.excerpt,
        seoTitle: post.title,
        updatedAt: post.publishedAt
      }
    : undefined;
}

function withStaticPageSeo(slug: string, locale: Locale) {
  const page = getPage(slug, locale);
  return page
    ? {
        ...page,
        seoDescription: page.description,
        seoTitle: page.title
      }
    : undefined;
}

function normalizeRouteSlug(slug: string) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const repairedSlug = Buffer.from(decodedSlug, "latin1").toString("utf8");

    if (/[\u3400-\u9fff]/.test(repairedSlug) && !repairedSlug.includes("�")) {
      return repairedSlug;
    }

    return decodedSlug;
  } catch {
    return slug;
  }
}

export async function getSitesForPage(locale: Locale) {
  const payload = await withCmsTimeout(getPayloadClient(), "Payload init").catch((error) => {
    console.error("Falling back to static sites", error);
    return null;
  });
  if (!payload) return withStaticSiteSeo(locale);

  try {
    const result = await withCmsTimeout(
      payload.find({
        collection: "sites",
        limit: 100,
        locale,
        overrideAccess: true,
        sort: "name"
      }),
      "Sites query"
    );

    if (!result.docs.length) return withStaticSiteSeo(locale);

    return result.docs.map((site) => ({
      accent: asAccent(site.accent),
      createdAt: asOptionalString(site.createdAt),
      featured: Boolean(site.featured),
      kind: asString(site.kind),
      name: asString(site.name),
      seoDescription: asOptionalString(site.seoDescription) || asString(site.summary),
      seoTitle: asOptionalString(site.seoTitle) || asString(site.name),
      slug: asString(site.slug),
      summary: asString(site.summary),
      updatedAt: asOptionalString(site.updatedAt),
      url: asString(site.url) || undefined
    }));
  } catch (error) {
    console.error("Falling back to static sites", error);
    return withStaticSiteSeo(locale);
  }
}

export async function getFeaturedSitesForPage(locale: Locale) {
  return (await getSitesForPage(locale)).filter((site) => site.featured);
}

export async function getSiteBySlugForPage(slug: string, locale: Locale) {
  const payload = await withCmsTimeout(getPayloadClient(), "Payload init").catch((error) => {
    console.error("Falling back to static site detail", error);
    return null;
  });
  if (!payload) return withStaticSiteDetailSeo(slug, locale);

  try {
    const result = await withCmsTimeout(
      payload.find({
        collection: "sites",
        limit: 1,
        locale,
        overrideAccess: true,
        where: {
          slug: {
            equals: slug
          }
        }
      }),
      "Site detail query"
    );

    const site = result.docs[0];
    if (!site) return withStaticSiteDetailSeo(slug, locale);
    const staticSite = getSiteBySlug(slug, locale);
    const description = lexicalToParagraphs(site.description);
    const audience = lexicalToParagraphs(site.audience);
    const features = lexicalToParagraphs(site.features);
    const faq = Array.isArray(site.faq)
      ? site.faq
          .map((item) => ({
            answer: asString(item?.answer),
            question: asString(item?.question)
          }))
          .filter((item) => item.answer && item.question)
      : [];

    return {
      accent: asAccent(site.accent),
      audience: audience.length ? audience : staticSite?.audience || [],
      description: description.length ? description : staticSite?.description || [],
      faq: faq.length ? faq : staticSite?.faq || [],
      features: features.length ? features : staticSite?.features || [],
      kind: asString(site.kind),
      name: asString(site.name),
      createdAt: asOptionalString(site.createdAt),
      seoDescription: asOptionalString(site.seoDescription) || asString(site.summary),
      seoTitle: asOptionalString(site.seoTitle) || asString(site.name),
      slug: asString(site.slug),
      summary: asString(site.summary),
      updatedAt: asOptionalString(site.updatedAt),
      url: asString(site.url) || undefined
    };
  } catch (error) {
    console.error("Falling back to static site detail", error);
    return withStaticSiteDetailSeo(slug, locale);
  }
}

export async function getPostsForPage(locale: Locale) {
  const payload = await withCmsTimeout(getPayloadClient(), "Payload init").catch((error) => {
    console.error("Falling back to static posts", error);
    return null;
  });
  if (!payload) return withStaticPostSeo(locale);

  try {
    const result = await withCmsTimeout(
      payload.find({
        collection: "posts",
        limit: 100,
        overrideAccess: true,
        sort: "-publishedAt",
        where: {
          language: {
            equals: locale
          }
        }
      }),
      "Posts query"
    );

    return result.docs.map((post) => ({
      createdAt: asOptionalString(post.createdAt),
      excerpt: asString(post.excerpt),
      publishedAt: asString(post.publishedAt),
      seoDescription: asOptionalString(post.seoDescription) || asString(post.excerpt),
      seoTitle: asOptionalString(post.seoTitle) || asString(post.title),
      slug: asString(post.slug),
      title: asString(post.title),
      updatedAt: asOptionalString(post.updatedAt)
    }));
  } catch (error) {
    console.error("Falling back to static posts", error);
    return withStaticPostSeo(locale);
  }
}

export async function getLatestPostsForPage(locale: Locale, limit = 3) {
  return (await getPostsForPage(locale)).slice(0, limit);
}

export async function getPostSlugsForPage(locale?: Locale) {
  const payload = await withCmsTimeout(getPayloadClient(), "Payload init").catch((error) => {
    console.error("Falling back to static post slugs", error);
    return null;
  });
  if (!payload) return getPosts(locale || "en").map((post) => post.slug);

  try {
    const result = await withCmsTimeout(
      payload.find({
        collection: "posts",
        limit: 1000,
        overrideAccess: true,
        sort: "-publishedAt",
        where: locale
          ? {
              language: {
                equals: locale
              }
            }
          : undefined
      }),
      "Post slugs query",
      60000
    );

    return Array.from(new Set(result.docs.map((post) => asString(post.slug)).filter(Boolean)));
  } catch (error) {
    console.error("Falling back to static post slugs", error);
    return getPosts(locale || "en").map((post) => post.slug);
  }
}

export async function getPostBySlugForPage(slug: string, locale: Locale) {
  const normalizedSlug = normalizeRouteSlug(slug);
  const payload = await withCmsTimeout(getPayloadClient(), "Payload init").catch((error) => {
    console.error("Falling back to static post detail", error);
    return null;
  });
  if (!payload) return withStaticPostDetailSeo(normalizedSlug, locale);

  try {
    const result = await withCmsTimeout(
      payload.find({
        collection: "posts",
        limit: 1,
        overrideAccess: true,
        where: {
          and: [
            { slug: { equals: normalizedSlug } },
            { language: { equals: locale } }
          ]
        }
      }),
      "Post detail query"
    );

    const post = result.docs[0];
    if (!post) return undefined;

    return {
      body: post.body,
      createdAt: asOptionalString(post.createdAt),
      excerpt: asString(post.excerpt),
      publishedAt: asString(post.publishedAt),
      seoDescription: asOptionalString(post.seoDescription) || asString(post.excerpt),
      seoTitle: asOptionalString(post.seoTitle) || asString(post.title),
      slug: asString(post.slug),
      title: asString(post.title),
      updatedAt: asOptionalString(post.updatedAt)
    };
  } catch (error) {
    console.error("Falling back to static post detail", error);
    return withStaticPostDetailSeo(normalizedSlug, locale);
  }
}

export async function getPageForPage(slug: string, locale: Locale) {
  const payload = await withCmsTimeout(getPayloadClient(), "Payload init").catch((error) => {
    console.error("Falling back to static page", error);
    return null;
  });
  if (!payload) return withStaticPageSeo(slug, locale);

  try {
    const result = await withCmsTimeout(
      payload.find({
        collection: "pages",
        limit: 1,
        locale,
        overrideAccess: true,
        where: {
          slug: {
            equals: slug
          }
        }
      }),
      "Page query"
    );

    const page = result.docs[0];
    if (!page) return withStaticPageSeo(slug, locale);

    return {
      body: lexicalToParagraphs(page.body),
      createdAt: asOptionalString(page.createdAt),
      description: asString(page.description),
      seoDescription: asOptionalString(page.seoDescription) || asString(page.description),
      seoTitle: asOptionalString(page.seoTitle) || asString(page.title),
      slug: asString(page.slug),
      title: asString(page.title),
      updatedAt: asOptionalString(page.updatedAt)
    };
  } catch (error) {
    console.error("Falling back to static page", error);
    return withStaticPageSeo(slug, locale);
  }
}
