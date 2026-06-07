import config from "../../../../../payload.config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import type { Metadata } from "next";
import { hasPayloadEnv } from "@/lib/payload-env";
import { importMap } from "../importMap.js";

type AdminPageProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: AdminPageProps): Promise<Metadata> | Metadata => {
  if (!hasPayloadEnv()) {
    return {
      robots: {
        follow: false,
        index: false
      },
      title: "Payload CMS not configured"
    };
  }

  return generatePageMetadata({ config, params, searchParams });
};

export default function AdminPage({ params, searchParams }: AdminPageProps) {
  if (!hasPayloadEnv()) return null;

  return RootPage({ config, importMap, params, searchParams });
}
