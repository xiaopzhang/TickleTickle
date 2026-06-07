import { notFound } from "next/navigation";
import { getPublicPageSlugs, getSiteConfig } from "@/lib/content";
import { getPageForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, JsonLd } from "@/lib/structured-data";

type FixedPageProps = {
  params: Promise<{ locale: string; pageSlug: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublicPageSlugs().flatMap((pageSlug) => [
    { locale: "en", pageSlug },
    { locale: "zh", pageSlug }
  ]);
}

export async function generateMetadata({ params }: FixedPageProps) {
  const { locale, pageSlug } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const page = await getPageForPage(pageSlug, safeLocale);
  return buildPageMetadata({
    locale: safeLocale,
    path: `/${pageSlug}`,
    title: page?.seoTitle || page?.title || "Page",
    description: page?.seoDescription || page?.description || "TickleTickle page.",
    imageTitle: page?.title
  });
}

export default async function FixedPage({ params }: FixedPageProps) {
  const { locale: rawLocale, pageSlug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const page = await getPageForPage(pageSlug, locale);
  const config = getSiteConfig();
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageJsonLd({
            locale,
            path: `/${page.slug}`,
            title: page.title,
            description: page.description
          }),
          buildBreadcrumbJsonLd({
            locale,
            items: [{ name: page.title, path: `/${page.slug}` }]
          })
        ]}
      />
      <main className="content-page">
      <div className="shell">
        <p className="kicker">TickleTickle</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.description}</p>
        <article className="content-panel">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
        {page.slug === "contact" ? (
          <section className="contact-card" aria-label={locale === "zh" ? "联系邮箱" : "Contact email"}>
            <div>
              <span className="meta">{locale === "zh" ? "邮箱" : "Email"}</span>
              <p>{config.email}</p>
            </div>
            <a className="button primary" href={`mailto:${config.email}`}>
              {locale === "zh" ? "发送邮件" : "Send Email"}
            </a>
          </section>
        ) : null}
      </div>
      </main>
    </>
  );
}
