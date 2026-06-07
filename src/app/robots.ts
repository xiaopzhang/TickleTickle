import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/og", "/ads.txt", "/sitemap.xml"],
      disallow: ["/admin", "/api"]
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
