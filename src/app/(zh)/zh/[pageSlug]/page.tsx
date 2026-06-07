import FixedPage, { generateMetadata as generateLocalizedMetadata } from "@/app/_localized/[pageSlug]/page";
import { getPublicPageSlugs } from "@/lib/content";

type PageProps = {
  params: Promise<{ pageSlug: string }>;
};

export function generateStaticParams() {
  return getPublicPageSlugs().map((pageSlug) => ({ pageSlug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { pageSlug } = await params;
  return generateLocalizedMetadata({ params: Promise.resolve({ locale: "zh", pageSlug }) });
}

export default async function Page({ params }: PageProps) {
  const { pageSlug } = await params;
  return FixedPage({ params: Promise.resolve({ locale: "zh", pageSlug }) });
}
