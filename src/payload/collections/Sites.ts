import type { CollectionConfig } from "payload";
import { slugifyText } from "@/lib/slug";
import { revalidateProjectPaths } from "@/payload/revalidate";

export const Sites: CollectionConfig = {
  slug: "sites",
  labels: {
    singular: "Project",
    plural: "Projects"
  },
  admin: {
    defaultColumns: ["name", "kind", "url", "summary", "updatedAt"],
    group: "Content",
    useAsTitle: "name"
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        data.slug = data.slug || slugifyText(data.name, "project");
        data.accent = data.accent || "green";
        data.featured = data.featured ?? true;
        data.seoTitle = data.seoTitle || data.name;
        data.seoDescription = data.seoDescription || data.summary;

        return data;
      }
    ],
    afterChange: [
      ({ doc }) => {
        revalidateProjectPaths(typeof doc.slug === "string" ? doc.slug : undefined);
      }
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateProjectPaths(typeof doc.slug === "string" ? doc.slug : undefined);
      }
    ]
  },
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "kind", type: "text", label: "Category", localized: true, required: true },
    { name: "summary", type: "textarea", label: "Intro", localized: true, required: true },
    {
      name: "url",
      type: "text",
      label: "Link",
      admin: {
        description: "The public URL visitors open from the project page."
      }
    },
    { name: "slug", type: "text", admin: { hidden: true }, required: true, unique: true },
    { name: "description", type: "richText", admin: { hidden: true }, localized: true },
    { name: "audience", type: "richText", admin: { hidden: true }, localized: true },
    { name: "features", type: "richText", admin: { hidden: true }, localized: true },
    {
      name: "faq",
      type: "array",
      admin: { hidden: true },
      fields: [
        { name: "question", type: "text", localized: true, required: true },
        { name: "answer", type: "textarea", localized: true, required: true }
      ]
    },
    {
      name: "accent",
      type: "select",
      admin: { hidden: true },
      defaultValue: "green",
      options: [
        { label: "Green", value: "green" },
        { label: "Blue", value: "blue" }
      ]
    },
    { name: "featured", type: "checkbox", admin: { hidden: true }, defaultValue: true },
    { name: "seoTitle", type: "text", admin: { hidden: true }, localized: true },
    { name: "seoDescription", type: "textarea", admin: { hidden: true }, localized: true }
  ]
};
