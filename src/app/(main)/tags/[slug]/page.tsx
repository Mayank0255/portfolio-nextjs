"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/utils/postMatch";
import { markdownToHtml, markdownProseClass } from "@/lib/markdown";
import type { Post } from "@/data/portfolio";

const ITEMS_PER_PAGE = 10;

function slugifyTag(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function PostCardProject({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} className="block card-clickable rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-[var(--link-color)]">
          {post.title}
        </h3>
      </div>
      {post.description && (
        <div
          className={`text-[var(--foreground)] mb-4 ${markdownProseClass}`}
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.description) }}
        />
      )}
      {(post.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags!.map((t, i) => (
            <span
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/tags/${slugify(t)}`;
              }}
              className="bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-full text-sm hover:opacity-80 cursor-pointer"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <span className="inline-flex items-center gap-2 text-[var(--link-color)]">
        Read more
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

export default function TagPage() {
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");
  const { data } = usePortfolio();
  const posts = data.posts || [];
  const [page, setPage] = useState(1);

  const filtered = posts.filter(
    (p) => (p.tags || []).some((t) => slugifyTag(t) === slug)
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagePosts = filtered.slice(start, start + ITEMS_PER_PAGE);
  const tagName = slug.replace(/-/g, " ");

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="text-sm font-medium text-[var(--text-muted)] mb-6">
        <Link href="/" className="text-[var(--link-color)] hover:underline">Home</Link>
        <span className="mx-2 opacity-70">/</span>
        <Link href="/topics" className="text-[var(--link-color)] hover:underline">Topics</Link>
        <span className="mx-2 opacity-70">/</span>
        <span className="text-[var(--foreground)] capitalize">{tagName}</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)] capitalize">
        {tagName}
      </h1>
      <p className="text-[var(--text-muted)] font-medium mb-8">{filtered.length} posts</p>

      <div className="grid md:grid-cols-2 gap-6">
        {pagePosts.map((post) => (
          <PostCardProject key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-8" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--tag-bg)] transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[var(--foreground)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--tag-bg)] transition-colors"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
