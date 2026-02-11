"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";

export default function TopicsPage() {
  const { data } = usePortfolio();
  const posts = data.posts || [];

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    const tags = post.tags || [];
    for (const tag of tags) {
      const t = tag.trim();
      if (t) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    }
  }
  const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="text-sm font-medium text-[var(--text-muted)] mb-6">
        <Link href="/" className="text-[var(--link-color)] hover:underline">Home</Link>
        <span className="mx-2 opacity-70">/</span>
        <span className="text-[var(--foreground)]">Topics</span>
      </nav>
      <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">Topics</h1>

      <div className="card-surface rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count]) => {
            const slug = tag.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
            return (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(slug)}`}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--tag-fg)] hover:border-[var(--link-color)] hover:text-[var(--link-color)] transition-colors"
              >
                {tag}
                <span className="text-[var(--text-muted)] ml-1">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
