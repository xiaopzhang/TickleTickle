import Link from "next/link";
import { PreviewWindow } from "@/components/preview-window";
import { PostCard } from "@/components/post-card";
import { SiteCard } from "@/components/site-card";
import { getFeaturedSitesForPage, getLatestPostsForPage } from "@/lib/cms-content";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { buildWebSiteJsonLd, JsonLd } from "@/lib/structured-data";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  return buildPageMetadata({
    locale: safeLocale,
    path: "",
    title: safeLocale === "zh" ? "TickleTickle - 独立产品、AI 工具与创业记录" : "TickleTickle - Indie products, AI tools, and build notes",
    description:
      safeLocale === "zh"
        ? "TickleTickle 收录有度打造的网站与小工具，也分享创业实验、产品思考和长期旅行中的真实记录。"
        : "TickleTickle collects Youdu's indie websites and tools, plus build-in-public notes, product thinking, and stories from long-term travel.",
    imageSubtitle: safeLocale === "zh" ? "有度的独立产品与长期旅行记录" : "Youdu's indie products and long-term travel notes"
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const sites = await getFeaturedSitesForPage(locale);
  const posts = await getLatestPostsForPage(locale);
  const zh = locale === "zh";

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd(locale)} />
      <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <p className="kicker">{zh ? "有度的独立产品与长期旅行记录" : "Youdu's indie products and long-term travel notes"}</p>
            <h1>{zh ? "把有趣的想法做成产品，把一路的思考写成故事。" : "Turning curious ideas into products, and the road into stories."}</h1>
            <p className="hero-copy">
              {zh
                ? "我是有度，一名独立开发者和长期旅行者。TickleTickle 收录我打造的网站与小工具，也分享创业实验、产品思考、AI 工具探索和真实的 Build in Public 记录。"
                : "I'm Youdu, an indie developer and long-term traveler. TickleTickle collects the websites and tools I build, plus startup experiments, product thinking, AI tool explorations, and honest build-in-public notes."}
            </p>
            <div className="actions">
              <Link className="button primary" href={localizedPath(locale, "/projects")}>
                {zh ? "查看项目" : "Explore Projects"}
              </Link>
              <Link className="button secondary" href={localizedPath(locale, "/blog")}>
                {zh ? "阅读博客" : "Read the Blog"}
              </Link>
            </div>
            <div className="pill-row" aria-label="Site qualities">
              <span className="pill">{zh ? "独立开发" : "Indie building"}</span>
              <span className="pill">{zh ? "AI 工具" : "AI tools"}</span>
              <span className="pill">{zh ? "数字游民生活" : "Digital nomad life"}</span>
            </div>
          </div>

          <div className="preview-stack" aria-label="Website preview mockups">
            <PreviewWindow />
            <PreviewWindow compact />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-header">
            <div>
              <h2>{zh ? "精选项目" : "Featured Projects"}</h2>
              <p>
                {zh
                  ? "这里会展示我开发的网站、小工具和在线体验入口。每个项目都会说明用途、目标用户、开发背景和维护状态。"
                  : "This is where I showcase the websites, small tools, and online experiences I build. Each page explains the use case, audience, context, and maintenance status."}
              </p>
            </div>
            <Link className="text-link" href={localizedPath(locale, "/projects")}>
              {zh ? "查看全部" : "View all projects"}
            </Link>
          </div>

          <div className="site-grid">
            {sites.map((site) => (
              <SiteCard key={site.slug} locale={locale} site={site} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-header">
            <div>
              <h2>{zh ? "最新短篇" : "Latest Notes"}</h2>
              <p>
                {zh
                  ? "博客会记录产品开发日志、创业踩坑、经验总结、个人思考，以及长期旅行中的成长经历。"
                  : "The blog records product logs, startup lessons, mistakes, reflections, and personal growth from building while traveling."}
              </p>
            </div>
            <Link className="text-link" href={localizedPath(locale, "/blog")}>
              {zh ? "浏览博客" : "Browse the blog"}
            </Link>
          </div>

          <div className="notes-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} locale={locale} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="about-panel">
            <div>
              <h2>{zh ? "由真实作者维护，像真实网站一样认真。" : "Built by a real person, maintained like a real site."}</h2>
              <p>
                {zh
                  ? "TickleTickle 由有度长期维护。这里不仅是项目入口，也是公开记录产品实验、创业经验和个人成长的主站。"
                  : "TickleTickle is maintained by Youdu. It is both a project hub and a public record of product experiments, startup lessons, and personal growth."}
              </p>
            </div>
            <ul className="check-list" aria-label="Compliance and trust checklist">
              <li>{zh ? "About、Contact、Privacy、Terms 和 Cookie 页面" : "About, Contact, Privacy, Terms, and Cookie pages"}</li>
              <li>{zh ? "项目、小工具和在线体验入口" : "Projects, tools, and online experience links"}</li>
              <li>{zh ? "Build in Public 与创业复盘" : "Build-in-public logs and startup retrospectives"}</li>
              <li>{zh ? "Sitemap、canonical 和 hreflang 元数据" : "Sitemap, canonical URLs, and hreflang metadata"}</li>
            </ul>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
