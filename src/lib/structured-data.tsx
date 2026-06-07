import { getSiteConfig } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}

export function buildWebSiteJsonLd(locale: Locale) {
  const config = getSiteConfig();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    url: absoluteUrl(localizedPath(locale)),
    inLanguage: locale,
    description: config.tagline[locale],
    publisher: buildPublisherJsonLd()
  };
}

export function buildPublisherJsonLd() {
  const config = getSiteConfig();

  return {
    "@type": "Person",
    name: "Youdu",
    url: absoluteUrl("/"),
    email: config.email
  };
}

export function buildCollectionPageJsonLd({
  locale,
  path,
  title,
  description
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl(localizedPath(locale, path)),
    inLanguage: locale,
    isPartOf: buildWebSiteReferenceJsonLd(locale)
  };
}

export function buildBlogPostingJsonLd({
  locale,
  path,
  title,
  description,
  publishedAt,
  updatedAt
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(localizedPath(locale, path)),
    mainEntityOfPage: absoluteUrl(localizedPath(locale, path)),
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    inLanguage: locale,
    author: buildPublisherJsonLd(),
    publisher: buildPublisherJsonLd(),
    isPartOf: buildWebSiteReferenceJsonLd(locale)
  };
}

export function buildProjectJsonLd({
  locale,
  path,
  name,
  description,
  url,
  category
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  url?: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    applicationCategory: category,
    url: url || absoluteUrl(localizedPath(locale, path)),
    mainEntityOfPage: absoluteUrl(localizedPath(locale, path)),
    inLanguage: locale,
    creator: buildPublisherJsonLd(),
    isPartOf: buildWebSiteReferenceJsonLd(locale)
  };
}

export function buildFaqJsonLd(faq: Array<{ question: string; answer: string }>) {
  const validItems = faq.filter((item) => item.question && item.answer);
  if (!validItems.length) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildBreadcrumbJsonLd({
  locale,
  items
}: {
  locale: Locale;
  items: Array<{ name: string; path: string }>;
}) {
  const homeLabel = locale === "zh" ? "首页" : "Home";
  const allItems = [{ name: homeLabel, path: "" }, ...items];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path))
    }))
  };
}

function buildWebSiteReferenceJsonLd(locale: Locale) {
  const config = getSiteConfig();

  return {
    "@type": "WebSite",
    name: config.name,
    url: absoluteUrl(localizedPath(locale))
  };
}
