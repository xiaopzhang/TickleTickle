import { notFound } from "next/navigation";
import { getSiteSlugs } from "@/lib/content";
import { getSiteBySlugForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

type SiteDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return getSiteSlugs().flatMap((slug) => [
    { locale: "en", slug },
    { locale: "zh", slug }
  ]);
}

export async function generateMetadata({ params }: SiteDetailPageProps) {
  const { locale, slug } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const site = await getSiteBySlugForPage(slug, safeLocale);
  return buildPageMetadata({
    locale: safeLocale,
    path: `/sites/${slug}`,
    title: site?.name || "Site",
    description: site?.summary || "A TickleTickle project page."
  });
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const site = await getSiteBySlugForPage(slug, locale);
  if (!site) notFound();

  return (
    <main className="content-page">
      <div className="shell">
        <p className="kicker">{site.kind}</p>
        <h1>{site.name}</h1>
        <p className="lead">{site.summary}</p>
        {site.url ? (
          <div className="actions">
            <a className="button primary" href={site.url}>
              {locale === "zh" ? "访问网站" : "Visit Website"}
            </a>
          </div>
        ) : (
          <p className="status-note">{locale === "zh" ? "公开地址准备好后会在这里更新。" : "The public URL will be added here when it is ready."}</p>
        )}

        <div className={`site-shot ${site.accent === "blue" ? "blue" : ""}`} style={{ marginTop: 32, borderRadius: 8 }}>
          <div className="mini-window">
            <div className="browser-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="address" />
            </div>
            <div className="mini-body">
              <div className="mini-media" />
              <div className="mini-copy">
                <span className="mock-line dark" />
                <span className="mock-line medium" />
                <span className="mock-line short" />
                <span className="mock-line medium" />
              </div>
            </div>
          </div>
        </div>

        <article className="content-panel">
          <h2>{locale === "zh" ? "它是做什么的" : "What it does"}</h2>
          {site.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <h2>{locale === "zh" ? "适合谁" : "Who it is for"}</h2>
          <ul>
            {site.audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>{locale === "zh" ? "主要功能" : "Key features"}</h2>
          <ul>
            {site.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>{locale === "zh" ? "常见问题" : "FAQ"}</h2>
          {site.faq.map((item) => (
            <section key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
