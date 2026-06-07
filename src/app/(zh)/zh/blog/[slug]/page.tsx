import PostDetailPage, { generateMetadata as generateLocalizedMetadata } from "@/app/_localized/blog/[slug]/page";
import { getPostSlugsForPage } from "@/lib/cms-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPostSlugsForPage("zh")).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generateLocalizedMetadata({ params: Promise.resolve({ locale: "zh", slug }) });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return PostDetailPage({ params: Promise.resolve({ locale: "zh", slug }) });
}
