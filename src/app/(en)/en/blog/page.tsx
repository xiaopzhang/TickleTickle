import BlogPage, { generateMetadata as generateLocalizedMetadata } from "@/app/_localized/blog/page";

const params = Promise.resolve({ locale: "en" });

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return BlogPage({ params });
}
