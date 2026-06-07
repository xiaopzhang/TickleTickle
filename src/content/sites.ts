import type { LocalizedRichText, LocalizedText } from "./site";

export type SiteRecord = {
  slug: string;
  kind: LocalizedText;
  name: string;
  url?: string;
  summary: LocalizedText;
  description: LocalizedRichText;
  audience: LocalizedRichText;
  features: LocalizedRichText;
  faq: Array<{
    question: LocalizedText;
    answer: LocalizedText;
  }>;
  accent: "green" | "blue";
  featured: boolean;
};

export const sites: SiteRecord[] = [
  {
    slug: "tickletickle",
    kind: { en: "Main site", zh: "主网站" },
    name: "TickleTickle",
    url: "https://tickletickle.space",
    summary: {
      en: "Youdu's bilingual home for indie products, useful tools, build-in-public notes, startup lessons, and travel reflections.",
      zh: "有度的中英双语主站，收录独立产品、小工具、Build in Public 记录、创业复盘和旅行中的思考。"
    },
    description: {
      en: [
        "TickleTickle is the central place where I collect the websites and tools I build as an indie developer.",
        "It is also a writing home. I use it to publish product development logs, build-in-public updates, startup experiments, mistakes, lessons, and personal reflections from long-term travel."
      ],
      zh: [
        "TickleTickle 是我作为独立开发者集中收录自己开发的网站和小工具的地方。",
        "它也是一个写作主站。我会在这里发布产品开发日志、Build in Public 更新、创业实验、踩坑复盘，以及长期旅行中的个人思考。"
      ]
    },
    audience: {
      en: [
        "Readers interested in indie hacking, AI tools, side projects, digital nomad life, and productivity tools.",
        "People who enjoy discovering useful products and honest stories from real startup experiments."
      ],
      zh: [
        "对独立开发、AI 工具、副业创业、数字游民生活方式和效率工具感兴趣的人。",
        "喜欢发现有趣产品和真实创业经历的读者。"
      ]
    },
    features: {
      en: [
        "Showcase personal websites and small tools",
        "Provide online experience links for tools",
        "Publish build-in-public product logs",
        "Share startup mistakes and lessons",
        "Record personal reflections and growth"
      ],
      zh: ["展示个人开发的网站和小工具", "提供工具在线体验入口", "发布产品开发日志（Build in Public）", "分享创业踩坑与经验总结", "记录个人思考与成长经历"]
    },
    faq: [
      {
        question: { en: "Who runs TickleTickle?", zh: "TickleTickle 是谁维护的？" },
        answer: { en: "TickleTickle is maintained by Youdu, an indie developer and long-term traveler.", zh: "TickleTickle 由有度维护。他是一名独立开发者和长期旅行者。" }
      },
      {
        question: { en: "What will be published here?", zh: "这里会发布什么内容？" },
        answer: { en: "The site publishes product pages, tool links, build logs, startup lessons, AI tool notes, and personal reflections.", zh: "这里会发布产品页面、工具入口、开发日志、创业复盘、AI 工具笔记和个人思考。" }
      }
    ],
    accent: "green",
    featured: true
  },
  {
    slug: "life-progress-bar",
    kind: { en: "Tool playground", zh: "工具实验室" },
    name: "life progress bar",
    url: "https://lifeprogressbar.tickletickle.space/",
    summary: {
      en: "A lightweight browser tool for seeing life progress through clear, visual time bars.",
      zh: "一个轻量浏览器工具，用清晰的可视化进度条查看人生时间进度。"
    },
    description: {
      en: [
        "life progress bar is a small utility built around one direct idea: make time visible.",
        "It helps visitors turn abstract dates and life stages into simple progress bars that are easy to understand at a glance."
      ],
      zh: [
        "life progress bar 是一个围绕“让时间可视化”这个简单想法做的小工具。",
        "它帮助访问者把抽象日期和人生阶段变成一眼能理解的进度条。"
      ]
    },
    audience: {
      en: ["People who like reflective productivity tools.", "Readers interested in small, focused web utilities."],
      zh: ["喜欢反思型效率工具的人。", "对小而明确的网页工具感兴趣的读者。"]
    },
    features: {
      en: ["Browser-based experience", "Visual progress bars", "Simple date-based calculation", "Clear use case", "Lightweight interface"],
      zh: ["浏览器在线体验", "可视化进度条", "基于日期的简单计算", "清晰使用场景", "轻量界面"]
    },
    faq: [
      {
        question: { en: "Is it free to use?", zh: "它可以免费使用吗？" },
        answer: { en: "Yes. It is a small public tool that can be opened directly in the browser.", zh: "可以。它是一个可以直接在浏览器打开的小工具。" }
      },
      {
        question: { en: "Does it collect personal data?", zh: "它会收集个人数据吗？" },
        answer: { en: "Any project that collects data should explain that clearly in its own privacy notice.", zh: "如果某个项目收集数据，它应该在自己的隐私说明中明确写出。" }
      }
    ],
    accent: "blue",
    featured: true
  }
];
