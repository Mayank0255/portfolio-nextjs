"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";
import { useState } from "react";

export default function ActivitiesPage() {
  const { data } = usePortfolio();
  const posts = data.posts || [];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categoriesMap = new Map<string, Map<string, { slug: string; count: number }>>();
  for (const post of posts) {
    const cats = post.categories || [];
    const top = cats[0];
    const sub = cats[1];
    if (!top) continue;
    if (!categoriesMap.has(top)) {
      categoriesMap.set(top, new Map());
    }
    const subMap = categoriesMap.get(top)!;
    if (sub) {
      const slug = sub.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      const prev = subMap.get(sub) || { slug, count: 0 };
      subMap.set(sub, { ...prev, count: prev.count + 1 });
    }
  }

  const topCategories = Array.from(categoriesMap.entries());

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="text-sm font-medium text-[var(--text-muted)] mb-6">
        <Link href="/" className="text-[var(--link-color)] hover:underline">Home</Link>
        <span className="mx-2 opacity-70">/</span>
        <span className="text-[var(--foreground)]">Activities</span>
      </nav>
      <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)]">Activities</h1>

      <div className="space-y-4">
        {topCategories.map(([topName, subMap]) => {
          const subList = Array.from(subMap.entries());
          const isOpen = expanded[topName] ?? true;
          return (
            <div key={topName} className="card-surface rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded((e) => ({ ...e, [topName]: !isOpen }))}
                className="w-full flex items-center justify-between gap-4 p-4 text-left font-semibold text-[var(--foreground)] bg-[var(--card-header-bg)] hover:opacity-90 transition-opacity"
              >
                <span>{topName}</span>
                <span className="text-sm font-medium text-[var(--text-muted)] shrink-0">
                  {subList.length} categories, {posts.filter((p) => (p.categories || [])[0] === topName).length} posts
                </span>
                <span className="text-[var(--text-muted)]">{isOpen ? "▼" : "▶"}</span>
              </button>
              {isOpen && (
                <ul className="divide-y divide-[var(--card-border)]">
                  {subList.map(([subName, { slug, count }]) => (
                    <li key={subName}>
                      <Link
                        href={`/categories/${encodeURIComponent(slug)}`}
                        className="flex items-center justify-between p-4 text-[var(--foreground)] hover:bg-[var(--tag-bg)] transition-colors"
                      >
                        <span className="font-medium">{subName}</span>
                        <span className="text-sm font-medium text-[var(--text-muted)]">{count} posts</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
