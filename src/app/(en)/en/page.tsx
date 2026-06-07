import HomePage, { generateMetadata as generateLocalizedMetadata } from "@/app/_localized/page";

const params = Promise.resolve({ locale: "en" });

export function generateMetadata() {
  return generateLocalizedMetadata({ params });
}

export default function Page() {
  return HomePage({ params });
}
