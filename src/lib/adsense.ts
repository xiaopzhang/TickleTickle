export function normalizeAdsensePublisherId(publisherId?: string) {
  if (!publisherId) return "";
  return publisherId.trim().replace(/^ca-/, "");
}

export function getAdsenseClientId(publisherId?: string) {
  const normalized = normalizeAdsensePublisherId(publisherId);
  return normalized ? `ca-${normalized}` : "";
}
