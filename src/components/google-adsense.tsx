import { getAdsenseClientId } from "@/lib/adsense";

export function GoogleAdSense() {
  const clientId = getAdsenseClientId(process.env.ADSENSE_PUBLISHER_ID);

  if (!clientId) {
    return null;
  }

  return <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`} crossOrigin="anonymous" />;
}
