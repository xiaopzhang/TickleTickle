import ProjectDetailPage, { generateMetadata as generateLocalizedMetadata } from "@/app/_localized/projects/[slug]/page";
import { getSiteSlugs } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getSiteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generateLocalizedMetadata({ params: Promise.resolve({ locale: "zh", slug }) });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return ProjectDetailPage({ params: Promise.resolve({ locale: "zh", slug }) });
}
