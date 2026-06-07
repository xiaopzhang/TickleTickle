import { PostCard } from "@/components/post-card";
import { getPostsForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, JsonLd } from "@/lib/structured-data";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  return buildPageMetadata({
    locale: safeLocale,
    path: "/blog",
    title: safeLocale === "zh" ? "博客" : "Blog",
    description: safeLocale === "zh" ? "关于独立开发、小工具和双语发布的短篇记录。" : "Short notes about independent building, small tools, and bilingual publishing."
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const posts = await getPostsForPage(locale);
  const title = locale === "zh" ? "博客" : "Blog";
  const description =
    locale === "zh" ? "记录产品想法、开发过程、更新和中英双语发布实践。" : "Product thinking, building notes, updates, and bilingual publishing practice.";

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageJsonLd({
            locale,
            path: "/blog",
            title,
            description
          }),
          buildBreadcrumbJsonLd({
            locale,
            items: [{ name: title, path: "/blog" }]
          })
        ]}
      />
      <main className="content-page">
      <div className="shell">
        <p className="kicker">{locale === "zh" ? "短篇记录" : "Short notes"}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        <div className="notes-grid" style={{ marginTop: 28 }}>
          {posts.map((post) => (
            <PostCard key={post.slug} locale={locale} post={post} />
          ))}
        </div>
      </div>
      </main>
    </>
  );
}
