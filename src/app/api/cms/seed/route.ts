import config from "../../../../../payload.config";
import { pages } from "@/content/pages";
import { posts } from "@/content/posts";
import { siteConfig } from "@/content/site";
import { sites } from "@/content/sites";
import { hasPayloadEnv, payloadEnvUnavailableResponse } from "@/lib/payload-env";
import { paragraphsToLexical } from "@/lib/lexical";
import { getPayload } from "payload";

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function hasSeedAccess(request: Request) {
  const secret = process.env.CMS_SEED_SECRET;
  return Boolean(secret && request.headers.get("x-cms-seed-secret") === secret);
}

export async function POST(request: Request) {
  if (!hasSeedAccess(request)) return unauthorized();
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();

  const payload = await getPayload({ config });
  const result = {
    settings: false,
    sites: 0,
    pages: 0,
    posts: 0
  };

  await payload.updateGlobal({
    slug: "settings",
    data: {
      adsensePublisherId: process.env.ADSENSE_PUBLISHER_ID || "",
      contactEmail: siteConfig.email,
      siteName: siteConfig.name,
      siteUrl: siteConfig.domain
    }
  });
  result.settings = true;

  for (const site of sites) {
    const existing = await payload.find({
      collection: "sites",
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: site.slug
        }
      }
    });

    const createOrUpdate = async (locale: "zh" | "en", id?: string | number) => {
      const data = {
        accent: site.accent,
        audience: paragraphsToLexical(site.audience[locale]),
        description: paragraphsToLexical(site.description[locale]),
        faq: site.faq.map((item) => ({
          answer: item.answer[locale],
          question: item.question[locale]
        })),
        featured: site.featured,
        features: paragraphsToLexical(site.features[locale]),
        kind: site.kind[locale],
        name: site.name,
        seoDescription: site.summary[locale],
        seoTitle: site.name,
        slug: site.slug,
        summary: site.summary[locale],
        url: site.url || ""
      };

      if (id) {
        return payload.update({ collection: "sites", id, data, locale, overrideAccess: true });
      }

      return payload.create({ collection: "sites", data, locale, overrideAccess: true });
    };

    const id = existing.docs[0]?.id;
    const document = await createOrUpdate("zh", id);
    await createOrUpdate("en", document.id);
    result.sites += 1;
  }

  for (const page of pages) {
    const existing = await payload.find({
      collection: "pages",
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: page.slug
        }
      }
    });

    const createOrUpdate = async (locale: "zh" | "en", id?: string | number) => {
      const data = {
        body: paragraphsToLexical(page.body[locale]),
        description: page.description[locale],
        seoDescription: page.description[locale],
        seoTitle: page.title[locale],
        slug: page.slug,
        title: page.title[locale]
      };

      if (id) {
        return payload.update({ collection: "pages", id, data, locale, overrideAccess: true });
      }

      return payload.create({ collection: "pages", data, locale, overrideAccess: true });
    };

    const id = existing.docs[0]?.id;
    const document = await createOrUpdate("zh", id);
    await createOrUpdate("en", document.id);
    result.pages += 1;
  }

  for (const post of posts) {
    const zhPost = await payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: post.slug } },
          { language: { equals: "zh" } }
        ]
      }
    });

    const zhData = {
      body: paragraphsToLexical(post.body.zh),
      excerpt: post.excerpt.zh,
      language: "zh",
      publishedAt: post.publishedAt,
      seoDescription: post.excerpt.zh,
      seoTitle: post.title.zh,
      slug: post.slug,
      title: post.title.zh,
      translationStatus: "published"
    };

    const zhDocument = zhPost.docs[0]
      ? await payload.update({ collection: "posts", id: zhPost.docs[0].id, data: zhData, overrideAccess: true })
      : await payload.create({ collection: "posts", data: zhData, overrideAccess: true });

    const enPost = await payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: post.slug } },
          { language: { equals: "en" } }
        ]
      }
    });

    const enData = {
      body: paragraphsToLexical(post.body.en),
      excerpt: post.excerpt.en,
      language: "en",
      publishedAt: post.publishedAt,
      seoDescription: post.excerpt.en,
      seoTitle: post.title.en,
      slug: post.slug,
      title: post.title.en,
      translationOf: zhDocument.id,
      translationStatus: "reviewed"
    };

    if (enPost.docs[0]) {
      await payload.update({ collection: "posts", id: enPost.docs[0].id, data: enData, overrideAccess: true });
    } else {
      await payload.create({ collection: "posts", data: enData, overrideAccess: true });
    }

    result.posts += 2;
  }

  return Response.json({ ok: true, result });
}
