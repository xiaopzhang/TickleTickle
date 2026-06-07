import type { CollectionConfig } from "payload";
import { lexicalToParagraphs } from "@/lib/lexical";
import { slugifyText } from "@/lib/slug";
import { revalidatePostPaths } from "@/payload/revalidate";
import { upsertEnglishPostTranslation } from "@/payload/translate-post";

function excerptFromBody(body: unknown) {
  return lexicalToParagraphs(body).join(" ").replace(/\s+/g, " ").trim().slice(0, 180);
}

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "language", "translationStatus", "publishedAt"]
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        const generatedExcerpt = excerptFromBody(data.body);
        data.slug = data.slug || slugifyText(data.title || generatedExcerpt, "post");
        data.excerpt = generatedExcerpt || data.excerpt || data.title;
        data.publishedAt = data.publishedAt || new Date().toISOString();
        data.seoTitle = data.title;
        data.seoDescription = data.excerpt;

        return data;
      }
    ],
    afterChange: [
      async ({ doc, req }) => {
        revalidatePostPaths(typeof doc.slug === "string" ? doc.slug : undefined);

        if (doc.language !== "zh") return;

        try {
          const englishPost = await upsertEnglishPostTranslation(req.payload, doc);
          if (englishPost?.slug) revalidatePostPaths(String(englishPost.slug));
        } catch (error) {
          console.error("Failed to translate Chinese post to English", error);
        }
      }
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePostPaths(typeof doc.slug === "string" ? doc.slug : undefined);
      }
    ]
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "richText", required: true },
    { name: "slug", type: "text", admin: { hidden: true }, required: true },
    { name: "excerpt", type: "textarea", admin: { hidden: true }, required: true },
    {
      name: "language",
      type: "select",
      required: true,
      defaultValue: "zh",
      options: [
        { label: "Chinese", value: "zh" },
        { label: "English", value: "en" }
      ]
    },
    {
      name: "translationStatus",
      type: "select",
      defaultValue: "none",
      options: [
        { label: "None", value: "none" },
        { label: "Draft", value: "draft" },
        { label: "Reviewed", value: "reviewed" },
        { label: "Published", value: "published" }
      ]
    },
    { name: "translationOf", type: "relationship", relationTo: "posts" },
    { name: "publishedAt", type: "date", admin: { hidden: true } },
    { name: "seoTitle", type: "text", admin: { hidden: true } },
    { name: "seoDescription", type: "textarea", admin: { hidden: true } }
  ]
};
