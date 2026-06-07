import { SiteCard } from "@/components/site-card";
import { getSitesForPage } from "@/lib/cms-content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, JsonLd } from "@/lib/structured-data";

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  return buildPageMetadata({
    locale: safeLocale,
    path: "/projects",
    title: safeLocale === "zh" ? "项目" : "Projects",
    description:
      safeLocale === "zh"
        ? "浏览 TickleTickle 展示的小工具、兴趣网站和在线项目。"
        : "Browse the tools, interest websites, and online projects showcased by TickleTickle."
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const projects = await getSitesForPage(locale);
  const title = locale === "zh" ? "项目" : "Projects";
  const description = locale === "zh" ? "这里展示我开发的网站、小工具和在线体验入口。" : "A directory of websites, small tools, and online experiences I build.";

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageJsonLd({
            locale,
            path: "/projects",
            title,
            description
          }),
          buildBreadcrumbJsonLd({
            locale,
            items: [{ name: title, path: "/projects" }]
          })
        ]}
      />
      <main className="content-page">
      <div className="shell">
        <p className="kicker">{locale === "zh" ? "项目目录" : "Project directory"}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        <div className="site-grid" style={{ marginTop: 28 }}>
          {projects.map((project) => (
            <SiteCard key={project.slug} locale={locale} site={project} />
          ))}
        </div>
      </div>
      </main>
    </>
  );
}
