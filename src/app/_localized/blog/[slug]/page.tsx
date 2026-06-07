import { notFound } from "next/navigation";
import { RichTextContent } from "@/components/rich-text-content";
import { getPostBySlugForPage, getPostSlugsForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd, JsonLd } from "@/lib/structured-data";

type PostDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const [enSlugs, zhSlugs] = await Promise.all([getPostSlugsForPage("en"), getPostSlugsForPage("zh")]);

  return [
    ...enSlugs.map((slug) => ({ locale: "en", slug })),
    ...zhSlugs.map((slug) => ({ locale: "zh", slug }))
  ];
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { locale, slug } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const post = await getPostBySlugForPage(slug, safeLocale);
  return buildPageMetadata({
    locale: safeLocale,
    path: `/blog/${slug}`,
    title: post?.seoTitle || post?.title || "Blog post",
    description: post?.seoDescription || post?.excerpt || "A TickleTickle blog post.",
    type: "article",
    publishedTime: post?.publishedAt,
    modifiedTime: post?.updatedAt || post?.publishedAt,
    imageTitle: post?.title,
    imageSubtitle: post?.excerpt
  });
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const post = await getPostBySlugForPage(slug, locale);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingJsonLd({
            locale,
            path: `/blog/${post.slug}`,
            title: post.title,
            description: post.excerpt,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt
          }),
          buildBreadcrumbJsonLd({
            locale,
            items: [
              { name: locale === "zh" ? "博客" : "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` }
            ]
          })
        ]}
      />
      <main className="content-page">
      <div className="shell">
        <p className="kicker">{post.publishedAt}</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.excerpt}</p>
        <article className="content-panel">
          <RichTextContent value={post.body} />
        </article>
      </div>
      </main>
    </>
  );
}
