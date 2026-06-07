import type { CollectionConfig } from "payload";
import { revalidatePagePaths } from "@/payload/revalidate";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Content",
    useAsTitle: "title"
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePagePaths(typeof doc.slug === "string" ? doc.slug : undefined);
      }
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePagePaths(typeof doc.slug === "string" ? doc.slug : undefined);
      }
    ]
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea", localized: true, required: true },
    { name: "body", type: "richText", localized: true, required: true },
    { name: "seoTitle", type: "text", localized: true },
    { name: "seoDescription", type: "textarea", localized: true }
  ]
};
