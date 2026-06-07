import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

type BuildMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  imageTitle?: string;
  imageSubtitle?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string) {
  const config = getSiteConfig();
  const base = config.domain.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

function ogLocale(locale: Locale) {
  return locale === "zh" ? "zh_CN" : "en_US";
}

export function buildOgImageUrl({ locale, title, subtitle }: { locale: Locale; title: string; subtitle?: string }) {
  const params = new URLSearchParams({
    locale,
    title
  });

  if (subtitle) params.set("subtitle", subtitle);

  return absoluteUrl(`/og?${params.toString()}`);
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  publishedTime,
  modifiedTime,
  imageTitle,
  imageSubtitle,
  noIndex
}: BuildMetadataInput): Metadata {
  const localized = localizedPath(locale, path);
  const url = absoluteUrl(localized);
  const imageUrl = buildOgImageUrl({
    locale,
    title: imageTitle || title,
    subtitle: imageSubtitle || description
  });

  return {
    title,
    description,
    robots: noIndex
      ? {
          follow: false,
          index: false
        }
      : undefined,
    alternates: {
      canonical: url,
      languages: {
        en: absoluteUrl(localizedPath("en", path)),
        zh: absoluteUrl(localizedPath("zh", path)),
        "x-default": absoluteUrl(localizedPath("en", path))
      }
    },
    openGraph: {
      title,
      description,
      url,
      siteName: getSiteConfig().name,
      locale: ogLocale(locale),
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime
          }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}
