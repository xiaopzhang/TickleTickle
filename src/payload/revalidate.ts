import { revalidatePath } from "next/cache";

const publicLocales = ["en", "zh"] as const;

function revalidatePublicPaths(paths: string[]) {
  for (const path of [...paths, "/sitemap.xml"]) {
    try {
      revalidatePath(path);
    } catch (error) {
      console.error(`Failed to revalidate ${path}`, error);
    }
  }
}

export function revalidateProjectPaths(slug?: string) {
  revalidatePublicPaths(
    publicLocales.flatMap((locale) => [
      `/${locale}`,
      `/${locale}/projects`,
      `/${locale}/sites`,
      ...(slug ? [`/${locale}/projects/${slug}`, `/${locale}/sites/${slug}`] : [])
    ])
  );
}

export function revalidatePostPaths(slug?: string) {
  revalidatePublicPaths(
    publicLocales.flatMap((locale) => [
      `/${locale}`,
      `/${locale}/blog`,
      ...(slug ? [`/${locale}/blog/${slug}`] : [])
    ])
  );
}

export function revalidatePagePaths(slug?: string) {
  revalidatePublicPaths(publicLocales.flatMap((locale) => [`/${locale}`, ...(slug ? [`/${locale}/${slug}`] : [])]));
}
