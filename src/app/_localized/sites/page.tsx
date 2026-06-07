import { SiteCard } from "@/components/site-card";
import { getSitesForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

type SitesPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: SitesPageProps) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  return buildPageMetadata({
    locale: safeLocale,
    path: "/sites",
    title: safeLocale === "zh" ? "网站" : "Sites",
    description: safeLocale === "zh" ? "浏览 TickleTickle 展示的小工具和兴趣网站。" : "Browse the small tools and interest websites showcased by TickleTickle."
  });
}

export default async function SitesPage({ params }: SitesPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const sites = await getSitesForPage(locale);

  return (
    <main className="content-page">
      <div className="shell">
        <p className="kicker">{locale === "zh" ? "项目目录" : "Project directory"}</p>
        <h1>{locale === "zh" ? "网站" : "Sites"}</h1>
        <p className="lead">
          {locale === "zh"
            ? "每个项目页都说明它做什么、适合谁、为什么被开发，以及后续如何维护。"
            : "Each project page explains what it does, who it is for, why it was built, and how it is maintained."}
        </p>
        <div className="site-grid" style={{ marginTop: 28 }}>
          {sites.map((site) => (
            <SiteCard key={site.slug} locale={locale} site={site} />
          ))}
        </div>
      </div>
    </main>
  );
}
