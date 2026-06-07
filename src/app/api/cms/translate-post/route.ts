import config from "../../../../../payload.config";
import { hasPayloadEnv, payloadEnvUnavailableResponse } from "@/lib/payload-env";
import { upsertEnglishPostTranslation } from "@/payload/translate-post";
import { getPayload } from "payload";

export const maxDuration = 60;

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function hasTranslationAccess(request: Request) {
  const secret = process.env.TRANSLATION_ROUTE_SECRET;
  return Boolean(secret && request.headers.get("x-translation-secret") === secret);
}

export async function POST(request: Request) {
  if (!hasTranslationAccess(request)) return unauthorized();
  if (!hasPayloadEnv()) return payloadEnvUnavailableResponse();
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: "DEEPSEEK_API_KEY is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as {
    id?: string | number;
    slug?: string;
  };

  if (!body.id && !body.slug) {
    return Response.json({ error: "Provide a Chinese post id or slug." }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const zhPost = body.id
    ? await payload.findByID({ collection: "posts", id: body.id, overrideAccess: true })
    : (
        await payload.find({
          collection: "posts",
          limit: 1,
          overrideAccess: true,
          where: {
            and: [
              { slug: { equals: body.slug } },
              { language: { equals: "zh" } }
            ]
          }
        })
      ).docs[0];

  if (!zhPost || zhPost.language !== "zh") {
    return Response.json({ error: "Chinese source post not found." }, { status: 404 });
  }

  const englishPost = await upsertEnglishPostTranslation(payload, zhPost);
  if (!englishPost) return Response.json({ error: "English translation was skipped." }, { status: 503 });

  return Response.json({
    ok: true,
    englishPost: {
      id: englishPost.id,
      slug: englishPost.slug,
      title: englishPost.title,
      translationStatus: englishPost.translationStatus
    }
  });
}
