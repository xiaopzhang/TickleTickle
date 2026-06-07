"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocale, localeLabels, localizedPath, type Locale } from "@/lib/i18n";

type LanguageSwitchProps = {
  locale: Locale;
  path?: string;
};

export function LanguageSwitch({ locale, path = "" }: LanguageSwitchProps) {
  const other = alternateLocale(locale);
  const pathname = usePathname();
  const activePath = path || pathname.replace(/^\/(en|zh)(?=\/|$)/, "") || "";

  return (
    <Link className="language-switch" href={localizedPath(other, activePath)} aria-label="Switch language">
      <span className={locale === "en" ? "active" : ""}>{localeLabels.en}</span>
      <span className={locale === "zh" ? "active" : ""}>{localeLabels.zh}</span>
    </Link>
  );
}
