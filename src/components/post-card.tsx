import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

type PostCardProps = {
  locale: Locale;
  post: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
  };
};

export function PostCard({ locale, post }: PostCardProps) {
  return (
    <article className="note-card">
      <div className="date">{post.publishedAt}</div>
      <h3>
        <Link href={localizedPath(locale, `/blog/${post.slug}`)}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
    </article>
  );
}
