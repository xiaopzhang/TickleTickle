import { normalizeAdsensePublisherId } from "@/lib/adsense";

export function GET() {
  const publisherId = normalizeAdsensePublisherId(process.env.ADSENSE_PUBLISHER_ID);

  if (!publisherId) {
    return new Response("", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    });
  }

  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
