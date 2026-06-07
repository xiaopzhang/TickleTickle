import type { Locale } from "@/lib/i18n";
import { pages } from "@/content/pages";
import { posts } from "@/content/posts";
import { siteConfig } from "@/content/site";
import { sites } from "@/content/sites";

export function getSiteConfig() {
  return siteConfig;
}

export function getSites(locale: Locale) {
  return sites.map((site) => ({
    slug: site.slug,
    name: site.name,
    kind: site.kind[locale],
    url: site.url,
    summary: site.summary[locale],
    accent: site.accent,
    featured: site.featured
  }));
}

export function getFeaturedSites(locale: Locale) {
  return getSites(locale).filter((site) => site.featured);
}

export function getSiteBySlug(slug: string, locale: Locale) {
  const site = sites.find((item) => item.slug === slug);
  if (!site) return undefined;

  return {
    slug: site.slug,
    name: site.name,
    kind: site.kind[locale],
    url: site.url,
    summary: site.summary[locale],
    description: site.description[locale],
    audience: site.audience[locale],
    features: site.features[locale],
    faq: site.faq.map((item) => ({
      question: item.question[locale],
      answer: item.answer[locale]
    })),
    accent: site.accent
  };
}

export function getPosts(locale: Locale) {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    publishedAt: post.publishedAt
  }));
}

export function getLatestPosts(locale: Locale, limit = 3) {
  return getPosts(locale).slice(0, limit);
}

export function getPostBySlug(slug: string, locale: Locale) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return undefined;

  return {
    slug: post.slug,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    publishedAt: post.publishedAt,
    body: post.body[locale]
  };
}

export function getPage(slug: string, locale: Locale) {
  const page = pages.find((item) => item.slug === slug);
  if (!page) return undefined;

  return {
    slug: page.slug,
    title: page.title[locale],
    description: page.description[locale],
    body: page.body[locale]
  };
}

export function getPublicPageSlugs() {
  return pages.map((page) => page.slug);
}

export function getSiteSlugs() {
  return sites.map((site) => site.slug);
}

export function getPostSlugs() {
  return posts.map((post) => post.slug);
}
