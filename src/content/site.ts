import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;
export type LocalizedRichText = Record<Locale, string[]>;

export const siteConfig = {
  name: "TickleTickle",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://tickletickle.space",
  email: "hello@tickletickle.space",
  nav: {
    projects: { en: "Projects", zh: "项目" },
    blog: { en: "Blog", zh: "博客" },
    about: { en: "About", zh: "关于" },
    contact: { en: "Contact", zh: "联系" }
  } satisfies Record<string, LocalizedText>,
  tagline: {
    en: "Indie products, useful tools, real notes",
    zh: "独立产品，实用工具，真实记录"
  } satisfies LocalizedText,
  footerLinks: [
    { slug: "privacy-policy", label: { en: "Privacy Policy", zh: "隐私政策" } },
    { slug: "terms", label: { en: "Terms", zh: "服务条款" } },
    { slug: "cookie-policy", label: { en: "Cookie Policy", zh: "Cookie 政策" } },
    { slug: "editorial-policy", label: { en: "Editorial Policy", zh: "编辑政策" } },
    { slug: "contact", label: { en: "Contact", zh: "联系我们" } }
  ]
};
