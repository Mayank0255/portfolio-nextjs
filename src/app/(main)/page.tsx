"use client";

import { About, Experience, Projects, Skills, Timeline } from "@/components/sections";
import { usePortfolio } from "@/context/PortfolioContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markdownToHtml, markdownProseClass } from "@/lib/markdown";
import { PageSkeleton } from "@/components/SkeletonLoading";

const ITEMS_PER_PAGE = 10;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface NewPostForm {
  title: string;
  description: string;
  content: string;
  categories: string;
  tags: string;
  date: string;
  pin: boolean;
  coverImage: string;
}

const initialFormState: NewPostForm = {
  title: "",
  description: "",
  content: "",
  categories: "",
  tags: "",
  date: getTodayDate(),
  pin: false,
  coverImage: "",
};

export default function Home() {
  const { data, isEditMode, isLoading, updateField } = usePortfolio();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newPost, setNewPost] = useState<NewPostForm>(initialFormState);

  const posts = data.posts || [];
  const pinned = posts.filter((p) => p.pin);
  const rest = posts.filter((p) => !p.pin);
  const allOrdered = [...pinned, ...rest];
  const totalPages = Math.ceil(allOrdered.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagePosts = allOrdered.slice(start, start + ITEMS_PER_PAGE);

  const handleAddPost = () => {
    if (!newPost.title.trim()) return;

    const slug = slugify(newPost.title);
    const newPostData = {
      id: `post-${Date.now()}`,
      slug,
      title: newPost.title.trim(),
      description: newPost.description.trim() || undefined,
      content: newPost.content.trim() || "# " + newPost.title.trim() + "\n\nWrite your content here...",
      date: newPost.date,
      categories: newPost.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      tags: newPost.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      pin: newPost.pin,
      ...(newPost.coverImage.trim() && { image: { src: newPost.coverImage.trim(), alt: newPost.title.trim() } }),
    };

    updateField("posts", [newPostData, ...posts]);
    setNewPost(initialFormState);
    setShowAddPostModal(false);

    // Navigate to the new post
    router.push(`/post/${slug}`);
  };

  const handleTogglePin = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newPosts = posts.map((p) =>
      p.id === postId ? { ...p, pin: !p.pin } : p
    );
    updateField("posts", newPosts);
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this post?")) {
      const newPosts = posts.filter((p) => p.id !== postId);
      updateField("posts", newPosts);
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <section id="about" className="mb-12">
          <About />
        </section>

        <section id="latest-activity" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[var(--foreground)]">Latest Activity</h2>
            {isEditMode && (
              <button
                onClick={() => setShowAddPostModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Post
              </button>
            )}
          </div>
          <div className="space-y-4">
            {pagePosts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="relative block card-clickable rounded-xl p-5"
              >
                {isEditMode && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <button
                      onClick={(e) => handleTogglePin(post.id, e)}
                      className={`transition-colors ${post.pin ? "text-yellow-500 hover:text-yellow-600" : "text-[var(--text-muted)] hover:text-yellow-500"}`}
                      title={post.pin ? "Unpin post" : "Pin post"}
                    >
                      <svg className="w-5 h-5" fill={post.pin ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeletePost(post.id, e)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
                <article>
                  {post.image?.src && (
                    <div className="mb-4 -mx-5 -mt-5 rounded-t-xl overflow-hidden">
                      <img
                        src={post.image.src}
                        alt={post.image.alt || post.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <h3 className="text-xl font-semibold mb-2 text-[var(--link-color)] flex-1">
                      {post.title}
                    </h3>
                    {post.pin && (
                      <span className="shrink-0 text-yellow-500" title="Pinned">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 4a1 1 0 01.117 1.993L16 6h-.764l-.924 4.618A3.5 3.5 0 0117 13.5V14h-4v6a1 1 0 01-1.993.117L11 20v-6H7v-.5a3.5 3.5 0 012.688-3.399L8.764 6H8a1 1 0 01-.117-1.993L8 4h8z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  {post.description && (
                    <div
                      className={`text-[var(--text-muted)] text-sm mb-3 line-clamp-2 leading-relaxed ${markdownProseClass}`}
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(post.description) }}
                    />
                  )}
                  <div className="flex flex-wrap gap-3 text-xs font-medium text-[var(--text-muted)]">
                    <span>{post.date}</span>
                    {post.categories?.length > 0 && (
                      <>
                        <span className="opacity-60">·</span>
                        <span>{post.categories.join(", ")}</span>
                      </>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-3 mt-8" aria-label="Pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--tag-bg)] transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-[var(--text-muted)]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--tag-bg)] transition-colors"
              >
                Next
              </button>
            </nav>
          )}
        </section>

        <section id="experience" className="mb-12">
          <Experience />
        </section>
        <section id="projects" className="mb-12">
          <Projects />
        </section>
        <section id="skills" className="mb-12">
          <Skills />
        </section>
        <section id="timeline" className="mb-12">
          <Timeline />
        </section>
      </div>

      {showHint && !isEditMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-gray-500">Hint: Type the secret phrase to edit</span>
        </div>
      )}

      {showAddPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-surface rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">
                Create New Post
              </h3>
              <button
                onClick={() => {
                  setShowAddPostModal(false);
                  setNewPost(initialFormState);
                }}
                className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)]"
                />
                {newPost.title && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Slug: {slugify(newPost.title)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Description
                </label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description (supports Markdown)..."
                  rows={2}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content here (supports Markdown)..."
                  rows={8}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)] resize-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={newPost.coverImage}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)]"
                />
                {newPost.coverImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-[var(--card-border)]">
                    <img
                      src={newPost.coverImage}
                      alt="Cover preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Categories
                  </label>
                  <input
                    type="text"
                    value={newPost.categories}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, categories: e.target.value }))}
                    placeholder="Work, Experience (comma-separated)"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="React, TypeScript (comma-separated)"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newPost.date}
                    onChange={(e) => setNewPost((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:outline-none focus:border-[var(--link-color)]"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPost.pin}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, pin: e.target.checked }))}
                      className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--link-color)] focus:ring-[var(--link-color)]"
                    />
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      Pin this post
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  setShowAddPostModal(false);
                  setNewPost(initialFormState);
                }}
                className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--tag-bg)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPost}
                disabled={!newPost.title.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
