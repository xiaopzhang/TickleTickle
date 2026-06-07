import { translateToEnglish } from "@/lib/deepseek";
import { lexicalToMarkdownLines, paragraphsToLexical } from "@/lib/lexical";
import { slugifyText } from "@/lib/slug";
import type { Payload } from "payload";

type PostLike = {
  id: string | number;
  body?: unknown;
  excerpt?: string | null;
  language?: string | null;
  publishedAt?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  slug?: string | null;
  title?: string | null;
};

async function getUniqueEnglishSlug(payload: Payload, baseSlug: string, currentPostId?: string | number) {
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: slug } },
          { language: { equals: "en" } }
        ]
      }
    });

    const conflict = existing.docs[0];
    if (!conflict || (currentPostId && String(conflict.id) === String(currentPostId))) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function upsertEnglishPostTranslation(payload: Payload, zhPost: PostLike) {
  if (zhPost.language !== "zh" || !zhPost.slug || !zhPost.title) return null;
  if (!process.env.DEEPSEEK_API_KEY) {
    console.warn("Skipping post translation because DEEPSEEK_API_KEY is not configured.");
    return null;
  }

  const translation = await translateToEnglish({
    body: lexicalToMarkdownLines(zhPost.body),
    excerpt: zhPost.excerpt || undefined,
    seoDescription: zhPost.seoDescription || undefined,
    seoTitle: zhPost.seoTitle || undefined,
    title: zhPost.title
  });

  const existingEnglishPost = await payload.find({
    collection: "posts",
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { translationOf: { equals: zhPost.id } },
        { language: { equals: "en" } }
      ]
    }
  });

  const legacyEnglishPost =
    existingEnglishPost.docs[0] ||
    (
      await payload.find({
        collection: "posts",
        limit: 1,
        overrideAccess: true,
        where: {
          and: [
            { slug: { equals: zhPost.slug } },
            { language: { equals: "en" } }
          ]
        }
      })
    ).docs[0];

  const englishSlug = await getUniqueEnglishSlug(
    payload,
    slugifyText(translation.seoTitle || translation.title, `post-${zhPost.id}`),
    legacyEnglishPost?.id
  );

  const translatedData = {
    body: paragraphsToLexical(translation.body),
    excerpt: translation.excerpt,
    language: "en",
    publishedAt: zhPost.publishedAt || new Date().toISOString(),
    seoDescription: translation.seoDescription,
    seoTitle: translation.seoTitle,
    slug: englishSlug,
    title: translation.title,
    translationOf: zhPost.id,
    translationStatus: "published"
  };

  return legacyEnglishPost
    ? payload.update({
        collection: "posts",
        id: legacyEnglishPost.id,
        data: translatedData,
        overrideAccess: true
      })
    : payload.create({
        collection: "posts",
        data: translatedData,
        overrideAccess: true
      });
}
