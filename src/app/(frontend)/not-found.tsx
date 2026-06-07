import Link from "next/link";

export default function NotFound() {
  return (
    <main className="content-page">
      <div className="shell">
        <p className="kicker">TickleTickle</p>
        <h1>Page not found</h1>
        <p className="lead">
          This page may have moved, or the link may be outdated. Try the projects directory or the blog.
        </p>
        <div className="actions">
          <Link className="button primary" href="/en/projects">
            Projects
          </Link>
          <Link className="button secondary" href="/en/blog">
            Blog
          </Link>
        </div>
      </div>
    </main>
  );
}
