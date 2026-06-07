import type { LocalizedRichText, LocalizedText } from "./site";

export type PageRecord = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  body: LocalizedRichText;
};

export const pages: PageRecord[] = [
  {
    slug: "about",
    title: { en: "About TickleTickle", zh: "关于 TickleTickle" },
    description: {
      en: "TickleTickle is Youdu's home for indie products, useful tools, build-in-public notes, and stories from long-term travel.",
      zh: "TickleTickle 是有度的独立产品、小工具、Build in Public 记录和长期旅行故事主站。"
    },
    body: {
      en: [
        "I'm Youdu, an indie developer and long-term traveler. I like turning interesting ideas into products and turning the thoughts from the road into stories.",
        "TickleTickle collects the websites and tools I build. It also shares startup experiments, product thinking, AI tool explorations, build-in-public logs, mistakes, lessons, and personal reflections."
      ],
      zh: [
        "我是有度，一名独立开发者和长期旅行者。我想把有趣的想法做成产品，也把一路的思考写成故事。",
        "TickleTickle 收录我打造的网站与小工具，也分享创业实验、产品思考、AI 工具探索、Build in Public 记录、踩坑经验和个人成长。"
      ]
    }
  },
  {
    slug: "contact",
    title: { en: "Contact", zh: "联系我们" },
    description: {
      en: "Contact TickleTickle about projects, corrections, partnerships, or privacy questions.",
      zh: "联系 TickleTickle，反馈项目、内容修正、合作或隐私相关问题。"
    },
    body: {
      en: [
        "For project feedback, corrections, partnership questions, or privacy requests, email hello@tickletickle.space.",
        "Please include the page URL and a short description when reporting an issue."
      ],
      zh: [
        "如果你想反馈项目、修正内容、咨询合作或提出隐私请求，可以发送邮件到 hello@tickletickle.space。",
        "反馈问题时，请尽量附上页面地址和简短说明。"
      ]
    }
  },
  {
    slug: "privacy-policy",
    title: { en: "Privacy Policy", zh: "隐私政策" },
    description: {
      en: "How TickleTickle handles analytics, cookies, advertising identifiers, and contact information.",
      zh: "说明 TickleTickle 如何处理分析、Cookie、广告标识符和联系信息。"
    },
    body: {
      en: [
        "TickleTickle may collect basic technical information such as browser type, device type, approximate location, referring pages, and pages viewed. This helps maintain the site and understand which content is useful.",
        "If Google AdSense or other advertising services are enabled, third-party vendors including Google may use cookies or advertising identifiers to serve and measure ads based on visits to this and other websites.",
        "Visitors can manage cookie preferences in their browser settings. If a certified consent management platform is required for certain regions, TickleTickle will display the relevant consent controls.",
        "If you contact TickleTickle by email, your email address and message content are used to respond to your request."
      ],
      zh: [
        "TickleTickle 可能会收集基础技术信息，例如浏览器类型、设备类型、大致位置、来源页面和访问页面。这些信息用于维护网站并理解哪些内容有帮助。",
        "如果启用 Google AdSense 或其他广告服务，包括 Google 在内的第三方服务商可能会使用 Cookie 或广告标识符，根据用户访问本站和其他网站的情况投放和衡量广告。",
        "访问者可以在浏览器设置中管理 Cookie 偏好。如果某些地区需要认证的同意管理平台，TickleTickle 会展示相应的同意控件。",
        "如果你通过邮件联系 TickleTickle，你的邮箱地址和邮件内容会被用于回复你的请求。"
      ]
    }
  },
  {
    slug: "terms",
    title: { en: "Terms of Service", zh: "服务条款" },
    description: {
      en: "Terms for using TickleTickle, its content, and links to external project websites.",
      zh: "说明使用 TickleTickle、本站内容和外部项目链接的相关条款。"
    },
    body: {
      en: [
        "TickleTickle provides project descriptions, links, screenshots, and short articles for informational purposes.",
        "External project websites may have their own terms, privacy practices, availability, and limitations. TickleTickle is not responsible for third-party websites outside its control.",
        "Content may be updated, corrected, removed, or reorganized as projects change."
      ],
      zh: [
        "TickleTickle 提供项目介绍、链接、截图和短篇文章，主要用于信息展示。",
        "外部项目网站可能有自己的条款、隐私做法、可用性和限制。TickleTickle 不对其控制范围之外的第三方网站负责。",
        "随着项目变化，本站内容可能会被更新、修正、移除或重新组织。"
      ]
    }
  },
  {
    slug: "cookie-policy",
    title: { en: "Cookie Policy", zh: "Cookie 政策" },
    description: {
      en: "How cookies may be used for site functionality, analytics, and advertising.",
      zh: "说明 Cookie 如何用于网站功能、分析和广告。"
    },
    body: {
      en: [
        "Cookies may be used to keep the site functional, remember preferences, measure traffic, and support advertising if ads are enabled.",
        "Google AdSense, analytics providers, or other third-party services may set their own cookies under their policies.",
        "You can block or delete cookies in your browser. Some features may work less smoothly if cookies are disabled."
      ],
      zh: [
        "Cookie 可能用于保持网站功能、记住偏好、衡量流量，以及在广告启用时支持广告服务。",
        "Google AdSense、分析服务或其他第三方服务可能会按照各自政策设置 Cookie。",
        "你可以在浏览器中阻止或删除 Cookie。禁用 Cookie 后，部分功能体验可能不够顺畅。"
      ]
    }
  },
  {
    slug: "editorial-policy",
    title: { en: "Editorial Policy", zh: "编辑政策" },
    description: {
      en: "How TickleTickle creates, translates, reviews, and updates content.",
      zh: "说明 TickleTickle 如何创作、翻译、审核和更新内容。"
    },
    body: {
      en: [
        "TickleTickle publishes original project descriptions and short articles based on the author's own building process.",
        "Chinese is the primary writing language. English drafts may be generated with DeepSeek API and reviewed before publication.",
        "If a page contains an error, outdated statement, or unclear translation, readers can contact hello@tickletickle.space for correction."
      ],
      zh: [
        "TickleTickle 发布基于作者实际开发过程的原创项目介绍和短篇文章。",
        "中文是主要创作语言。英文草稿可能由 DeepSeek API 生成，并在发布前进行检查。",
        "如果页面存在错误、过时表述或翻译不清楚的地方，读者可以通过 hello@tickletickle.space 联系修正。"
      ]
    }
  }
];
