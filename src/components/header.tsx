import Link from "next/link";
import { LanguageSwitch } from "@/components/language-switch";
import { getSiteConfig } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const config = getSiteConfig();

  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <Link className="brand" href={localizedPath(locale)}>
          <span className="brand-mark">T</span>
          <span className="brand-copy">
            <span className="brand-name">{config.name}</span>
            <span className="brand-note">{config.tagline[locale]}</span>
          </span>
        </Link>

        <div className="links">
          <Link href={localizedPath(locale, "/projects")}>{config.nav.projects[locale]}</Link>
          <Link href={localizedPath(locale, "/blog")}>{config.nav.blog[locale]}</Link>
          <Link href={localizedPath(locale, "/about")}>{config.nav.about[locale]}</Link>
          <Link href={localizedPath(locale, "/contact")}>{config.nav.contact[locale]}</Link>
          <LanguageSwitch locale={locale} />
        </div>
      </nav>
    </header>
  );
}
