"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";
import { TrendingSkeleton } from "./SkeletonLoading";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

const TRENDING_LIMIT = 12;

export function TrendingTopics() {
  const { data, isLoading } = usePortfolio();
  const posts = data.posts || [];
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      const t = tag.trim();
      if (t) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    }
  }
  const trending = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, TRENDING_LIMIT);

  if (isLoading) {
    return (
      <aside className="w-64 xl:w-72 shrink-0 hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <div className="card-surface rounded-xl p-5">
            <TrendingSkeleton />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 xl:w-72 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="card-surface rounded-xl p-5">
          <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {trending.map(([tag]) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(slugify(tag))}`}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--tag-bg)] border border-[var(--tag-border)] text-[var(--tag-fg)] hover:border-[var(--link-color)] hover:text-[var(--link-color)] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
