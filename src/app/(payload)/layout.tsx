import config from "../../../payload.config";
import "@payloadcms/next/css";
import { RootLayout } from "@payloadcms/next/layouts";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import React from "react";
import { getMissingPayloadEnv, hasPayloadEnv } from "@/lib/payload-env";
import { importMap } from "./admin/importMap.js";

type PayloadLayoutProps = {
  children: React.ReactNode;
};

export const maxDuration = 60;

export default function PayloadLayout({ children }: PayloadLayoutProps) {
  if (!hasPayloadEnv()) {
    const missing = getMissingPayloadEnv();

    return (
      <html lang="en">
        <body
          style={{
            background: "#fbfaf7",
            color: "#18211f",
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            margin: 0
          }}
        >
          <main style={{ margin: "0 auto", maxWidth: 760, padding: "72px 24px" }}>
            <p style={{ color: "#115e59", fontSize: 13, fontWeight: 700, margin: "0 0 14px" }}>
              TickleTickle CMS
            </p>
            <h1 style={{ fontSize: 42, letterSpacing: 0, lineHeight: 1, margin: 0 }}>
              Payload CMS needs database configuration.
            </h1>
            <p style={{ color: "#53615c", fontSize: 17, lineHeight: 1.7, marginTop: 20 }}>
              The public site is running, but the admin dashboard requires these environment variables:
            </p>
            <pre
              style={{
                background: "#ffffff",
                border: "1px solid #dde5df",
                borderRadius: 8,
                color: "#18211f",
                marginTop: 18,
                overflowX: "auto",
                padding: 18
              }}
            >
              {missing.map((key) => `${key}=...`).join("\n")}
            </pre>
            <p style={{ color: "#64716c", lineHeight: 1.7 }}>
              Add them to <code>.env.local</code>, restart <code>npm run dev</code>, then open{" "}
              <code>/admin</code> again.
            </p>
          </main>
        </body>
      </html>
    );
  }

  const serverFunction: ServerFunctionClient = async (args) => {
    "use server";

    return handleServerFunctions({
      ...args,
      config,
      importMap
    });
  };

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
