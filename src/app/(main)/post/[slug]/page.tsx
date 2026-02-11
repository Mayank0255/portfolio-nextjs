"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { markdownToHtml, markdownProseClass } from "@/lib/markdown";
import { EditableText, EditableList } from "@/components/EditableText";
import { EditableMarkdown } from "@/components/EditableMarkdown";
import { PostDetailSkeleton } from "@/components/SkeletonLoading";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

function CoverImageEditor({ postIndex, image, title }: { postIndex: number; image?: { src: string; alt?: string }; title: string }) {
  const { data, updateField } = usePortfolio();
  const [url, setUrl] = useState(image?.src || "");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    const posts = [...data.posts];
    if (url.trim()) {
      posts[postIndex] = { ...posts[postIndex], image: { src: url.trim(), alt: title } };
    } else {
      const { image: _removed, ...rest } = posts[postIndex];
      posts[postIndex] = rest as typeof posts[number];
    }
    updateField("posts", posts);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-[var(--link-color)] hover:underline"
      >
        {image?.src ? "Change cover image" : "+ Add cover image"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)]"
        autoFocus
      />
      <button onClick={handleSave} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Save
      </button>
      <button onClick={() => { setEditing(false); setUrl(image?.src || ""); }} className="text-xs px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--foreground)]">
        Cancel
      </button>
    </div>
  );
}

export default function PostPage() {
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");
  const { data, isEditMode, isLoading } = usePortfolio();
  const posts = data.posts || [];
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = postIndex >= 0 ? posts[postIndex] : null;

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-[var(--text-muted)]">Post not found.</p>
        <Link href="/" className="text-[var(--link-color)] hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  const related = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>{post.title}</span>
      </nav>

      <article className="mb-12">
        {/* Cover Image */}
        {(post.image?.src || isEditMode) && (
          <div className="mb-6">
            {post.image?.src && (
              <div className="rounded-xl overflow-hidden mb-2">
                <img
                  src={post.image.src}
                  alt={post.image.alt || post.title}
                  className="w-full max-h-[400px] object-cover"
                />
              </div>
            )}
            {isEditMode && (
              <CoverImageEditor postIndex={postIndex} image={post.image} title={post.title} />
            )}
          </div>
        )}

        {isEditMode ? (
          <EditableText
            path={`posts.${postIndex}.title`}
            value={post.title}
            as="h1"
            className="text-3xl font-bold mb-2 text-[var(--foreground)]"
          />
        ) : (
          <h1 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{post.title}</h1>
        )}

        {isEditMode ? (
          <EditableMarkdown
            path={`posts.${postIndex}.description`}
            value={post.description || ""}
            className="text-[var(--text-muted)] mb-4"
            placeholder="Add a description... (Markdown supported)"
          />
        ) : (
          post.description && (
            <div
              className={`text-[var(--text-muted)] mb-4 ${markdownProseClass}`}
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.description) }}
            />
          )
        )}

        <div className="flex flex-wrap gap-2 text-sm text-[var(--text-muted)] mb-6">
          {isEditMode ? (
            <EditableText
              path={`posts.${postIndex}.date`}
              value={post.date}
              as="span"
              className="text-sm text-[var(--text-muted)]"
            />
          ) : (
            <span>{post.date}</span>
          )}
          {(post.workTime || isEditMode) && (
            <>
              <span>|</span>
              {isEditMode ? (
                <EditableText
                  path={`posts.${postIndex}.workTime`}
                  value={post.workTime || ""}
                  as="span"
                  className="text-sm text-[var(--text-muted)]"
                />
              ) : (
                <span>{post.workTime}</span>
              )}
            </>
          )}
        </div>

        {isEditMode ? (
          <div className="border border-[var(--card-border)] rounded-lg p-4 bg-[var(--card-bg)]">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-2">Content (Markdown)</h3>
            <EditableMarkdown
              path={`posts.${postIndex}.content`}
              value={post.content}
              className="prose max-w-none"
              placeholder="Write your post content here... (Markdown supported)"
            />
          </div>
        ) : (
          <div
            className={`prose max-w-none ${markdownProseClass}`}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
          />
        )}

        {(post.categories?.length > 0 || post.tags?.length > 0 || isEditMode) && (
          <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
            <div className="mb-4">
              <span className="text-sm text-[var(--text-muted)] mr-2">Categories:</span>
              {isEditMode ? (
                <EditableList
                  path={`posts.${postIndex}.categories`}
                  items={post.categories || []}
                  itemClassName="inline-block mr-2 px-2 py-1 rounded border border-[var(--border-color)] text-sm"
                />
              ) : (
                post.categories?.map((c) => (
                  <Link
                    key={c}
                    href={`/categories/${encodeURIComponent(slugify(c))}`}
                    className="inline-block mr-2 px-2 py-1 rounded border border-[var(--border-color)] text-sm hover:opacity-80"
                  >
                    {c}
                  </Link>
                ))
              )}
            </div>
            <div>
              <span className="text-sm text-[var(--text-muted)] mr-2">Tags:</span>
              {isEditMode ? (
                <EditableList
                  path={`posts.${postIndex}.tags`}
                  items={post.tags || []}
                  itemClassName="inline-block mr-2 px-2 py-1 rounded border border-[var(--border-color)] text-sm"
                />
              ) : (
                post.tags?.map((t) => (
                  <Link
                    key={t}
                    href={`/tags/${encodeURIComponent(slugify(t))}`}
                    className="inline-block mr-2 px-2 py-1 rounded border border-[var(--border-color)] text-sm hover:opacity-80"
                  >
                    {t}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Further Reading</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/post/${p.slug}`}
                className="block p-4 card-clickable rounded-lg"
              >
                <h3 className="font-semibold text-[var(--link-color)]">{p.title}</h3>
                <span className="text-sm text-[var(--text-muted)]">{p.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
