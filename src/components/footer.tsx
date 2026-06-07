import Link from "next/link";
import { getSiteConfig } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
};

export function Footer({ locale }: FooterProps) {
  const config = getSiteConfig();

  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>© 2026 {config.name}. {config.tagline[locale]}.</span>
        <div className="footer-links">
          {config.footerLinks.map((link) => (
            <Link key={link.slug} href={localizedPath(locale, `/${link.slug}`)}>
              {link.label[locale]}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
