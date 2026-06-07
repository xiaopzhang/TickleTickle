import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Media } from "./src/payload/collections/Media.ts";
import { Pages } from "./src/payload/collections/Pages.ts";
import { Posts } from "./src/payload/collections/Posts.ts";
import { Sites } from "./src/payload/collections/Sites.ts";
import { Users } from "./src/payload/collections/Users.ts";
import { Settings } from "./src/payload/globals/Settings.ts";

export default buildConfig({
  admin: {
    user: Users.slug
  },
  collections: [Users, Media, Sites, Posts, Pages],
  globals: [Settings],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Chinese", code: "zh" }
    ],
    defaultLocale: "zh",
    fallback: true
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || ""
    },
    push: false
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL: process.env.NEXT_PUBLIC_SITE_URL
});
