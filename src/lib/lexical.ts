type LexicalTextNode = {
  detail: number;
  format: number;
  mode: "normal";
  style: string;
  text: string;
  type: "text";
  version: 1;
};

type LexicalParagraphNode = {
  children: LexicalTextNode[];
  direction: "ltr" | null;
  format: "";
  indent: number;
  textFormat: number;
  textStyle: string;
  type: "paragraph";
  version: 1;
};

export type LexicalRichText = {
  root: {
    children: LexicalParagraphNode[];
    direction: "ltr" | null;
    format: "";
    indent: number;
    type: "root";
    version: 1;
  };
};

export function paragraphsToLexical(paragraphs: string[]): LexicalRichText {
  return {
    root: {
      children: paragraphs.map((paragraph) => ({
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: paragraph,
            type: "text",
            version: 1
          }
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        textStyle: "",
        type: "paragraph",
        version: 1
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1
    }
  };
}

export function lexicalToParagraphs(value: unknown): string[] {
  if (!value || typeof value !== "object" || !("root" in value)) return [];
  const root = (value as { root?: { children?: unknown[] } }).root;
  if (!Array.isArray(root?.children)) return [];

  return root.children
    .map((node) => {
      if (!node || typeof node !== "object" || !("children" in node)) return "";
      const children = (node as { children?: unknown[] }).children;
      if (!Array.isArray(children)) return "";

      return children
        .map((child) => {
          if (!child || typeof child !== "object" || !("text" in child)) return "";
          const text = (child as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        })
        .join("");
    })
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function textFromLexicalNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  if ("text" in node && typeof (node as { text?: unknown }).text === "string") {
    return (node as { text: string }).text;
  }

  const children = (node as { children?: unknown[] }).children;
  if (!Array.isArray(children)) return "";
  return children.map(textFromLexicalNode).join("");
}

export function lexicalToMarkdownLines(value: unknown): string[] {
  if (!value || typeof value !== "object" || !("root" in value)) return [];
  const root = (value as { root?: { children?: unknown[] } }).root;
  if (!Array.isArray(root?.children)) return [];

  return root.children.flatMap((node) => {
    if (!node || typeof node !== "object") return [];

    const type = (node as { type?: unknown }).type;
    const tag = (node as { tag?: unknown }).tag;

    if (type === "heading") {
      const marker = tag === "h1" ? "# " : tag === "h3" ? "### " : "## ";
      const text = textFromLexicalNode(node).trim();
      return text ? [`${marker}${text}`] : [];
    }

    if (type === "list") {
      const children = (node as { children?: unknown[] }).children;
      if (!Array.isArray(children)) return [];
      const ordered = tag === "ol" || tag === "number";
      return children
        .map((child, index) => {
          const text = textFromLexicalNode(child).trim();
          if (!text) return "";
          return ordered ? `${index + 1}. ${text}` : `- ${text}`;
        })
        .filter(Boolean);
    }

    if (type === "quote") {
      const text = textFromLexicalNode(node).trim();
      return text ? [`> ${text}`] : [];
    }

    const text = textFromLexicalNode(node).trim();
    return text ? [text] : [];
  });
}
