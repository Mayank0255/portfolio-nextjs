"use client";

import { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { EditableText, EditableList } from "../EditableText";
import { EditableMarkdown } from "../EditableMarkdown";
import { formatTimelineDate } from "./timelineStyles";

/** Parse "Role at Company" from a post title. */
function parseTitle(title: string): { role: string; company: string } {
  const match = title.match(/^(.+?)\s+at\s+(.+)$/i);
  if (match) return { role: match[1].trim(), company: match[2].trim() };
  return { role: title, company: "" };
}

/** Check if a post belongs to work/experience categories. */
function isWorkPost(categories: string[]): boolean {
  return categories.some((c) => {
    const lower = c.toLowerCase();
    return lower.includes("work") || lower.includes("experience") || lower.includes("volunteering");
  });
}

export function Experience() {
  const { data, isEditMode, updateField, removeItem } = usePortfolio();
  const [showAddForm, setShowAddForm] = useState(false);
  const posts = data.posts || [];

  // Filter to work/experience posts, sort by date descending, track original index
  const workEntries = posts
    .map((post, originalIndex) => ({ post, originalIndex }))
    .filter(({ post }) => isWorkPost(post.categories || []))
    .sort((a, b) => b.post.date.localeCompare(a.post.date));

  const handleAddExperience = () => {
    const newPost = {
      id: `post-${Date.now()}`,
      slug: `new-experience-${Date.now()}`,
      title: "Role Title at Company",
      description: "Describe your role and achievements...",
      content: "Describe your role and achievements...",
      date: new Date().toISOString().split("T")[0],
      categories: ["🧑🏻‍💻 Work", "Experience"],
      tags: ["Technology"],
      workTime: "Full-Time",
    };
    updateField("posts", [...posts, newPost]);
    setShowAddForm(false);
  };

  const handleRemoveExperience = (originalIndex: number) => {
    removeItem("posts", originalIndex);
  };

  return (
    <section id="experience" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          Experience
        </h2>
        {isEditMode && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        )}
      </div>

      <div className="space-y-8">
        {workEntries.map(({ post, originalIndex }) => {
          const { role, company } = parseTitle(post.title);
          const isClickable = !isEditMode;
          const description = post.description || post.content.slice(0, 300).replace(/[#*_\n]/g, "").trim();
          const displayDate = formatTimelineDate(post.date);
          const technologies = post.tags || [];

          const cardContent = (
            <>
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveExperience(originalIndex);
                  }}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  {isEditMode ? (
                    <EditableText
                      path={`posts.${originalIndex}.title`}
                      value={post.title}
                      as="h3"
                      className="text-xl font-semibold text-[var(--foreground)]"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold text-[var(--link-color)]">
                      {role}
                    </h3>
                  )}
                  <div className="flex items-center gap-2">
                    {!isEditMode && company && (
                      <span className="text-[var(--link-color)] font-medium">{company}</span>
                    )}
                    {post.workTime && (
                      <>
                        {!isEditMode && company && (
                          <span className="text-[var(--text-muted)]">&bull;</span>
                        )}
                        {isEditMode ? (
                          <EditableText
                            path={`posts.${originalIndex}.workTime`}
                            value={post.workTime}
                            as="span"
                            className="text-[var(--text-muted)] text-sm"
                          />
                        ) : (
                          <span className="text-[var(--text-muted)] text-sm">{post.workTime}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[var(--text-muted)] text-sm mt-2 md:mt-0 whitespace-nowrap">
                  {displayDate}
                </span>
              </div>

              {isEditMode ? (
                <EditableMarkdown
                  path={`posts.${originalIndex}.description`}
                  value={description}
                  className="text-[var(--foreground)] mb-4"
                />
              ) : (
                <p className="text-[var(--foreground)] mb-4">{description}</p>
              )}

              {technologies.length > 0 && (
                isEditMode ? (
                  <EditableList
                    path={`posts.${originalIndex}.tags`}
                    items={technologies}
                    className="mt-4"
                    itemClassName="bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-full text-sm"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {technologies.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )
              )}
            </>
          );

          if (isClickable) {
            return (
              <Link
                key={post.id || post.slug}
                href={`/post/${post.slug}`}
                className="relative block rounded-xl p-6 card-clickable"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div
              key={post.id || post.slug}
              className="relative block rounded-xl p-6 card-surface"
            >
              {cardContent}
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-surface rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Add New Experience
            </h3>
            <p className="text-[var(--foreground)] mb-4">
              A new experience entry will be added. You can edit the details after adding.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--tag-bg)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExperience}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
