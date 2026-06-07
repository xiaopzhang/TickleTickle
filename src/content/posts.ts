import type { LocalizedRichText, LocalizedText } from "./site";

export type PostRecord = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  publishedAt: string;
  body: LocalizedRichText;
};

export const posts: PostRecord[] = [
  {
    slug: "why-tickletickle-exists",
    title: {
      en: "Why TickleTickle exists",
      zh: "为什么要做 TickleTickle"
    },
    excerpt: {
      en: "A short note on creating one reliable home for indie products, useful tools, and the stories behind them.",
      zh: "记录为什么需要一个主站来集中展示独立产品、小工具，以及它们背后的开发故事。"
    },
    publishedAt: "2026-05-28",
    body: {
      en: [
        "Interesting ideas are easy to start but surprisingly easy to lose. A tool may live on one domain, a side project in a private repository, and the lessons behind them disappear into scattered notes.",
        "TickleTickle is meant to be the home base: a clear place to explain what each product does, why it exists, how it changes, and what I learned while building it."
      ],
      zh: [
        "有趣的想法很容易开始，但也很容易散落在各处。一个工具在一个域名上，一个副业项目在私人仓库里，而背后的经验常常消失在零散笔记里。",
        "TickleTickle 的目标是做一个主站：清楚说明每个产品做什么、为什么存在、后续如何变化，以及我在开发过程中学到了什么。"
      ]
    }
  },
  {
    slug: "why-build-in-public-matters",
    title: {
      en: "Why build in public matters",
      zh: "为什么要 Build in Public？"
    },
    excerpt: {
      en: "Publishing progress, mistakes, and decisions makes small products easier to trust and easier to improve.",
      zh: "公开记录进度、错误和决策，会让小产品更可信，也更容易持续改进。"
    },
    publishedAt: "2026-05-22",
    body: {
      en: [
        "Build in public is not only a marketing tactic. For a small independent project, it is a way to leave a visible trail of decisions, tradeoffs, and lessons.",
        "That trail helps readers understand what changed and why. It also helps me avoid pretending that every product idea was clean from the beginning."
      ],
      zh: [
        "Build in Public 不只是营销动作。对一个小型独立项目来说，它是一条公开的痕迹，记录决策、取舍和教训。",
        "这条痕迹能帮助读者理解产品为什么变化，也能提醒我不要假装每个产品想法从一开始就很清晰。"
      ]
    }
  },
  {
    slug: "chinese-first-english-reviewed",
    title: {
      en: "Publishing in Chinese, reviewing in English",
      zh: "中文创作，英文审核后发布"
    },
    excerpt: {
      en: "Machine translation is helpful, but the final English page should still feel reviewed by a person.",
      zh: "机器翻译很有用，但最终英文页面仍然应该像被真人检查过。"
    },
    publishedAt: "2026-05-16",
    body: {
      en: [
        "Writing first in Chinese keeps the original voice natural. Translating with DeepSeek can create a fast English draft, but publishing should still include a quick review.",
        "That review is not only about grammar. It is about checking tone, removing awkward literal phrasing, and making sure the page says something useful."
      ],
      zh: [
        "先用中文写，可以保留最自然的表达。用 DeepSeek 翻译能快速得到英文草稿，但发布前仍然应该快速检查。",
        "这个检查不只是语法问题，还包括语气、直译痕迹，以及页面是否真的说了有用的内容。"
      ]
    }
  }
];
