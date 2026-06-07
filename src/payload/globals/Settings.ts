import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  fields: [
    { name: "siteName", type: "text", required: true, defaultValue: "TickleTickle" },
    { name: "siteUrl", type: "text", required: true },
    { name: "contactEmail", type: "email", required: true },
    { name: "adsensePublisherId", type: "text" }
  ]
};
