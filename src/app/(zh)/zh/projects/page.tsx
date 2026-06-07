import ProjectsPage, { generateMetadata as generateLocalizedMetadata } from "@/app/_localized/projects/page";

const params = Promise.resolve({ locale: "zh" });

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return ProjectsPage({ params });
}
