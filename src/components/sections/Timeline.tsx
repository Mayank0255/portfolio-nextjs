"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { EditableText } from "../EditableText";
import { EditableMarkdown } from "../EditableMarkdown";
import { typeColors, typeIcons, categoryToType, formatTimelineDate } from "./timelineStyles";

const HOME_TIMELINE_LIMIT = 10;

export function Timeline() {
  const { data, isEditMode, updateField, removeItem } = usePortfolio();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<"work" | "education" | "achievement" | "certification" | "publication">("work");

  const posts = data.posts || [];

  // Sort posts by ISO date descending, track original index for edit paths
  const sorted = posts
    .map((post, originalIndex) => ({ post, originalIndex }))
    .sort((a, b) => b.post.date.localeCompare(a.post.date));

  // Show limited items on home page
  const displayed = sorted.slice(0, HOME_TIMELINE_LIMIT);

  const handleAddEvent = () => {
    const typeToCategory: Record<string, string> = {
      work: "🧑🏻‍💻 Work",
      education: "🎓 Education",
      achievement: "Projects",
      certification: "Licenses & certifications",
      publication: "📝 Publications & Articles",
    };
    const newPost = {
      id: `post-${Date.now()}`,
      slug: `new-event-${Date.now()}`,
      title: "New Event",
      description: "Describe this event...",
      content: "Describe this event...",
      date: new Date().toISOString().split("T")[0],
      categories: [typeToCategory[newType] || "🧑🏻‍💻 Work"],
      tags: [],
    };
    updateField("posts", [...posts, newPost]);
    setShowAddForm(false);
  };

  const handleRemovePost = (originalIndex: number) => {
    removeItem("posts", originalIndex);
  };

  return (
    <section id="timeline" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          Timeline
        </h2>
        <div className="flex items-center gap-3">
          {isEditMode && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </button>
          )}
          {sorted.length > HOME_TIMELINE_LIMIT && (
            <Link
              href="/timeline"
              className="text-sm text-[var(--link-color)] hover:underline"
            >
              View all {sorted.length} →
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--card-border)]" />

        <div className="space-y-8">
          {displayed.map(({ post, originalIndex }) => {
            const type = categoryToType(post.categories || []);
            const isClickable = !isEditMode;
            const displayDate = formatTimelineDate(post.date);
            const description = post.description || post.content.slice(0, 200).replace(/[#*_\n]/g, "").trim();

            const cardContent = (
              <>
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemovePost(originalIndex);
                    }}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10"
                    title="Remove"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}

                <div className="flex items-center gap-3 mb-2">
                  {isEditMode ? (
                    <EditableText
                      path={`posts.${originalIndex}.date`}
                      value={post.date}
                      as="span"
                      className="text-sm font-medium text-[var(--text-muted)]"
                    />
                  ) : (
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {displayDate}
                    </span>
                  )}
                </div>

                {isEditMode ? (
                  <EditableText
                    path={`posts.${originalIndex}.title`}
                    value={post.title}
                    as="h3"
                    className="text-lg font-semibold text-[var(--foreground)] mb-2"
                  />
                ) : (
                  <h3 className={`text-lg font-semibold mb-2 ${isClickable ? "text-[var(--link-color)]" : "text-[var(--foreground)]"}`}>
                    {post.title}
                  </h3>
                )}

                {isEditMode ? (
                  <EditableMarkdown
                    path={`posts.${originalIndex}.description`}
                    value={description}
                    className="text-[var(--foreground)]"
                    compact
                  />
                ) : (
                  <p className="text-[var(--foreground)]">{description}</p>
                )}
              </>
            );

            return (
              <div key={post.id || post.slug} className="relative pl-12">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full ${typeColors[type] || typeColors.work} flex items-center justify-center text-white shadow-lg`}
                >
                  {typeIcons[type] || typeIcons.work}
                </div>

                {isClickable ? (
                  <Link
                    href={`/post/${post.slug}`}
                    className="relative block card-clickable rounded-xl p-6"
                  >
                    {cardContent}
                  </Link>
                ) : (
                  <div className="relative card-surface rounded-xl p-6">
                    {cardContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-surface rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Add Timeline Event
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Event Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as typeof newType)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-4 py-2"
              >
                <option value="work">Work</option>
                <option value="education">Education</option>
                <option value="achievement">Achievement</option>
                <option value="certification">Certification</option>
                <option value="publication">Publication</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--tag-bg)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
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
