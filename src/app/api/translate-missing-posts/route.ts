import config from "../../../../payload.config";
import { hasPayloadEnv, payloadEnvUnavailableResponse } from "@/lib/payload-env";
import { upsertEnglishPostTranslation } from "@/payload/translate-post";
import { getPayload } from "payload";

export const maxDuration = 60;

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function hasTranslationAccess(request: Request) {
  const translationSecret = process.env.TRANSLATION_ROUTE_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const translationHeader = request.headers.get("x-translation-secret");
  const authorization = request.headers.get("authorization");

  return Boolean(
    (translationSecret && translationHeader === translationSecret) ||
      (cronSecret && authorization === `Bearer ${cronSecret}`) ||
      (translationSecret && authorization === `Bearer ${translationSecret}`)
  );
}

async function translateMissing(limit = 5) {
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: "DEEPSEEK_API_KEY is not configured." }, { status: 503 });
  }

  const payload = await getPayload({ config });
  const zhPosts = await payload.find({
    collection: "posts",
    limit: 100,
    overrideAccess: true,
    sort: "-createdAt",
    where: {
      language: {
        equals: "zh"
      }
    }
  });

  const translated = [];
  const skipped = [];

  for (const zhPost of zhPosts.docs) {
    const existingEnglishPost = await payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: zhPost.slug } },
          { language: { equals: "en" } }
        ]
      }
    });

    if (existingEnglishPost.docs[0]) {
      skipped.push({ slug: zhPost.slug, reason: "exists" });
      continue;
    }

    const englishPost = await upsertEnglishPostTranslation(payload, zhPost);
    if (englishPost) translated.push({ id: englishPost.id, slug: englishPost.slug, title: englishPost.title });

    if (translated.length >= limit) break;
  }

  return Response.json({
    ok: true,
    checked: zhPosts.docs.length,
    translated,
    skipped
  });
}

export async function GET(request: Request) {
  if (!hasTranslationAccess(request)) return unauthorized();
  return translateMissing(3);
}

export async function POST(request: Request) {
  if (!hasTranslationAccess(request)) return unauthorized();
  const body = (await request.json().catch(() => ({}))) as { limit?: number };
  return translateMissing(Math.max(1, Math.min(body.limit || 5, 10)));
}
