import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { GoogleAdSense } from "@/components/google-adsense";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getSiteConfig } from "@/lib/content";

const config = getSiteConfig();
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s | ${config.name}`
  },
  description: "Youdu's bilingual home for indie products, AI tools, build-in-public notes, startup lessons, and long-term travel stories.",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <GoogleAnalytics />
        <GoogleAdSense />
      </body>
    </html>
  );
}
