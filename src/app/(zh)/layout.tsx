import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { Footer } from "@/components/footer";
import { GoogleAdSense } from "@/components/google-adsense";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { getSiteConfig } from "@/lib/content";

const config = getSiteConfig();
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s | ${config.name}`
  },
  description: "TickleTickle 是有度的独立产品、AI 工具、Build in Public 记录、创业复盘和长期旅行故事主站。",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined
};

export default function ChineseRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <body>
        <Header locale="zh" />
        {children}
        <Footer locale="zh" />
        <Analytics />
        <GoogleAnalytics />
        <GoogleAdSense />
      </body>
    </html>
  );
}
