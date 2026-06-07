import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630
};

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLocale = searchParams.get("locale") || "en";
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const title = clampText(searchParams.get("title") || getSiteConfig().name, 96);
  const subtitle = clampText(searchParams.get("subtitle") || getSiteConfig().tagline[locale], 150);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f7f3ea",
          color: "#17201c",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: 72,
          width: "100%"
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
            <div
              style={{
                alignItems: "center",
                background: "#173f35",
                borderRadius: 18,
                color: "#f8f2e8",
                display: "flex",
                fontSize: 42,
                fontWeight: 800,
                height: 72,
                justifyContent: "center",
                width: 72
              }}
            >
              T
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34, fontWeight: 800 }}>{getSiteConfig().name}</div>
              <div style={{ color: "#53615b", fontSize: 22 }}>{getSiteConfig().tagline[locale]}</div>
            </div>
          </div>
          <div style={{ color: "#53615b", fontSize: 24 }}>{locale === "zh" ? "中文" : "EN"}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 940 }}>
          <div style={{ color: "#2f6f5e", fontSize: 26, fontWeight: 700 }}>
            {locale === "zh" ? "独立产品 · AI 工具 · 真实记录" : "Indie products · AI tools · real notes"}
          </div>
          <div style={{ fontSize: 70, fontWeight: 850, lineHeight: 1.05 }}>{title}</div>
          <div style={{ color: "#53615b", fontSize: 30, lineHeight: 1.35 }}>{subtitle}</div>
        </div>

        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ color: "#53615b", fontSize: 24 }}>tickletickle.space</div>
          <div style={{ background: "#dff0db", borderRadius: 999, color: "#173f35", fontSize: 24, padding: "14px 24px" }}>
            {locale === "zh" ? "由有度维护" : "Built by Youdu"}
          </div>
        </div>
      </div>
    ),
    size
  );
}

function clampText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}
