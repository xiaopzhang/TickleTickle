import { translateToEnglish } from "@/lib/deepseek";

export const maxDuration = 60;

export async function POST(request: Request) {
  const secret = process.env.TRANSLATION_ROUTE_SECRET;
  const providedSecret = request.headers.get("x-translation-secret");

  if (!secret || providedSecret !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      excerpt?: string;
      body?: string[];
      seoTitle?: string;
      seoDescription?: string;
    };

    if (!body.title || !Array.isArray(body.body)) {
      return Response.json({ error: "title and body are required" }, { status: 400 });
    }

    const translation = await translateToEnglish({
      title: body.title,
      excerpt: body.excerpt,
      body: body.body,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription
    });

    return Response.json({ translation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown translation error";
    return Response.json({ error: message }, { status: 500 });
  }
}
