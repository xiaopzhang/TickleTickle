import type { MetadataRoute } from "next";
import { getPostsForPage, getSitesForPage } from "@/lib/cms-content";
import { getPublicPageSlugs } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/projects", "/blog"];
  const pagePaths = getPublicPageSlugs().map((slug) => `/${slug}`);

  const entriesByLocale = await Promise.all(
    locales.map(async (locale) => {
      const [posts, projects] = await Promise.all([getPostsForPage(locale), getSitesForPage(locale)]);
      const baseEntries = [...staticPaths, ...pagePaths].map((path) => ({
        path,
        lastModified: undefined,
        priority: path === "" ? 1 : path === "/blog" || path === "/projects" ? 0.85 : 0.65
      }));
      const projectEntries = projects.map((project) => ({
        path: `/projects/${project.slug}`,
        lastModified: project.updatedAt || project.createdAt,
        priority: 0.75
      }));
      const postEntries = posts.map((post) => ({
        path: `/blog/${post.slug}`,
        lastModified: post.updatedAt || post.publishedAt,
        priority: 0.7
      }));

      return { locale, entries: [...baseEntries, ...projectEntries, ...postEntries] };
    })
  );

  return entriesByLocale.flatMap(({ locale, entries }) =>
    entries.map((entry) => ({
      url: absoluteUrl(`/${locale}${entry.path}`),
      lastModified: entry.lastModified,
      changeFrequency: entry.path.includes("/blog/") ? "weekly" : "monthly",
      priority: entry.priority
    }))
  );
}
