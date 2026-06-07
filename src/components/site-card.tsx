import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

type SiteCardProps = {
  locale: Locale;
  site: {
    slug: string;
    name: string;
    kind: string;
    url?: string;
    summary: string;
    accent: "green" | "blue";
  };
};

export function SiteCard({ locale, site }: SiteCardProps) {
  return (
    <article className="site-card">
      <div className={`site-shot ${site.accent === "blue" ? "blue" : ""}`}>
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
      <div className="site-body">
        <span className="meta">{site.kind}</span>
        <h3>{site.name}</h3>
        <p>{site.summary}</p>
        <div className="card-actions">
          {site.url ? (
            <a className="small-button visit" href={site.url}>
              {locale === "zh" ? "访问项目" : "Visit Project"}
            </a>
          ) : (
            <span className="small-button visit disabled">{locale === "zh" ? "即将上线" : "Coming Soon"}</span>
          )}
          <Link className="small-button details" href={localizedPath(locale, `/projects/${site.slug}`)}>
            {locale === "zh" ? "查看详情" : "Read Details"}
          </Link>
        </div>
      </div>
    </article>
  );
}
