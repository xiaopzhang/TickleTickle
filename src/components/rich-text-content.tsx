import type { ReactNode } from "react";

type LexicalNode = {
  children?: LexicalNode[];
  format?: number | string;
  tag?: string;
  text?: string;
  type?: string;
  url?: string;
};

type LexicalValue = {
  root?: {
    children?: LexicalNode[];
  };
};

function textFromNode(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  return node.children?.map(textFromNode).join("") || "";
}

function isLexicalValue(value: unknown): value is LexicalValue {
  return Boolean(value && typeof value === "object" && "root" in value);
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const token = match[0];
    const key = `${keyPrefix}-${matchIndex}`;
    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/) || [];
      nodes.push(
        <a key={key} href={href}>
          {label}
        </a>
      );
    }

    lastIndex = match.index + token.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderMarkdownLines(lines: string[]) {
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = renderInlineMarkdown(heading[2], `h-${index}`);
      if (level === 1) blocks.push(<h2 key={index}>{content}</h2>);
      else if (level === 2) blocks.push(<h3 key={index}>{content}</h3>);
      else blocks.push(<h4 key={index}>{content}</h4>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul key={index}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item, `ul-${index}-${itemIndex}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={index}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineMarkdown(item, `ol-${index}-${itemIndex}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push(<blockquote key={index}>{renderInlineMarkdown(line.slice(2), `quote-${index}`)}</blockquote>);
      index += 1;
      continue;
    }

    blocks.push(<p key={index}>{renderInlineMarkdown(line, `p-${index}`)}</p>);
    index += 1;
  }

  return blocks;
}

function renderLexicalInline(nodes: LexicalNode[] | undefined, keyPrefix: string): ReactNode[] {
  return (nodes || []).map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    let content: ReactNode = node.children?.length ? renderLexicalInline(node.children, key) : textFromNode(node);

    if (node.type === "link" && node.url) {
      content = (
        <a key={key} href={node.url}>
          {content}
        </a>
      );
    }

    if (typeof node.format === "number") {
      if (node.format & 1) content = <strong key={`${key}-strong`}>{content}</strong>;
      if (node.format & 2) content = <em key={`${key}-em`}>{content}</em>;
      if (node.format & 8) content = <u key={`${key}-underline`}>{content}</u>;
      if (node.format & 16) content = <code key={`${key}-code`}>{content}</code>;
    }

    return <span key={key}>{content}</span>;
  });
}

function renderLexicalNode(node: LexicalNode, index: number): ReactNode {
  const text = textFromNode(node).trim();
  const inline = renderLexicalInline(node.children, `lexical-${index}`);

  if (node.type === "heading") {
    if (node.tag === "h1") return <h2 key={index}>{inline}</h2>;
    if (node.tag === "h3") return <h4 key={index}>{inline}</h4>;
    return <h3 key={index}>{inline}</h3>;
  }

  if (node.type === "quote") return <blockquote key={index}>{inline}</blockquote>;
  if (node.type === "list") {
    const ListTag = node.tag === "ol" || node.tag === "number" ? "ol" : "ul";
    return (
      <ListTag key={index}>
        {(node.children || []).map((child, childIndex) => (
          <li key={childIndex}>{renderLexicalInline(child.children, `list-${index}-${childIndex}`)}</li>
        ))}
      </ListTag>
    );
  }

  if (!text) return null;
  if (text.includes("\n") || /^(#{1,3}|[-*]|\d+\.|>)\s+/.test(text)) {
    return <div key={index}>{renderMarkdownLines(text.split(/\n+/))}</div>;
  }
  return <p key={index}>{renderInlineMarkdown(text, `lexical-md-${index}`)}</p>;
}

export function RichTextContent({ value }: { value: unknown }) {
  if (Array.isArray(value)) return <>{renderMarkdownLines(value.flatMap((item) => String(item).split(/\n+/)))}</>;
  if (!isLexicalValue(value)) return null;

  return <>{(value.root?.children || []).map(renderLexicalNode)}</>;
}
