import { notFound } from "next/navigation";
import { getSiteSlugs } from "@/lib/content";
import { getSiteBySlugForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildProjectJsonLd, JsonLd } from "@/lib/structured-data";

type ProjectDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";

export function generateStaticParams() {
  return getSiteSlugs().flatMap((slug) => [
    { locale: "en", slug },
    { locale: "zh", slug }
  ]);
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const project = await getSiteBySlugForPage(slug, safeLocale);
  return buildPageMetadata({
    locale: safeLocale,
    path: `/projects/${slug}`,
    title: project?.seoTitle || project?.name || "Project",
    description: project?.seoDescription || project?.summary || "A TickleTickle project page.",
    imageTitle: project?.name,
    imageSubtitle: project?.summary
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const project = await getSiteBySlugForPage(slug, locale);
  if (!project) notFound();
  const faqJsonLd = buildFaqJsonLd(project.faq);
  const jsonLd = [
    buildProjectJsonLd({
      locale,
      path: `/projects/${project.slug}`,
      name: project.name,
      description: project.summary,
      url: project.url,
      category: project.kind
    }),
    buildBreadcrumbJsonLd({
      locale,
      items: [
        { name: locale === "zh" ? "项目" : "Projects", path: "/projects" },
        { name: project.name, path: `/projects/${project.slug}` }
      ]
    }),
    ...(faqJsonLd ? [faqJsonLd] : [])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="content-page">
      <div className="shell">
        <p className="kicker">{project.kind}</p>
        <h1>{project.name}</h1>
        <p className="lead">{project.summary}</p>
        {project.url ? (
          <div className="actions">
            <a className="button primary" href={project.url}>
              {locale === "zh" ? "访问项目" : "Visit Project"}
            </a>
          </div>
        ) : (
          <p className="status-note">{locale === "zh" ? "公开地址准备好后会在这里更新。" : "The public URL will be added here when it is ready."}</p>
        )}

        <div className={`site-shot ${project.accent === "blue" ? "blue" : ""}`} style={{ marginTop: 32, borderRadius: 8 }}>
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
          <h2>{locale === "zh" ? "项目简介" : "Project intro"}</h2>
          {project.description.length ? (
            project.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>{project.summary}</p>
          )}

          {project.audience.length ? (
            <>
              <h2>{locale === "zh" ? "适合谁" : "Who it is for"}</h2>
              <ul>
                {project.audience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          {project.features.length ? (
            <>
              <h2>{locale === "zh" ? "主要功能" : "Key features"}</h2>
              <ul>
                {project.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          {project.faq.length ? (
            <>
              <h2>{locale === "zh" ? "常见问题" : "FAQ"}</h2>
              {project.faq.map((item) => (
                <section key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </section>
              ))}
            </>
          ) : null}
        </article>
      </div>
      </main>
    </>
  );
}
