"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { EditableText } from "../EditableText";
import { EditableMarkdown } from "../EditableMarkdown";
import { findPostSlugByTimelineEvent } from "@/utils/postMatch";
import { typeColors, typeIcons } from "./timelineStyles";

export function Timeline() {
  const { data, isEditMode, updateField } = usePortfolio();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<"work" | "education" | "achievement" | "certification" | "publication">("work");

  const handleAddEvent = () => {
    const newEvent = {
      id: `tl-${Date.now()}`,
      date: new Date().getFullYear().toString(),
      title: "New Event",
      description: "Describe this event...",
      type: newType,
    };
    updateField("timeline", [...data.timeline, newEvent]);
    setShowAddForm(false);
  };

  const handleRemoveEvent = (index: number) => {
    const newTimeline = data.timeline.filter((_, i) => i !== index);
    updateField("timeline", newTimeline);
  };

  const handleTypeChange = (index: number, newType: string) => {
    updateField(`timeline.${index}.type`, newType);
  };

  return (
    <section id="timeline" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          Timeline
        </h2>
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
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--card-border)]" />

        <div className="space-y-8">
          {data.timeline.map((event, index) => {
            const postSlug = findPostSlugByTimelineEvent(data.posts || [], event);
            const isClickable = !isEditMode && postSlug;

            const cardContent = (
              <>
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveEvent(index);
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
                      path={`timeline.${index}.date`}
                      value={event.date}
                      as="span"
                      className="text-sm font-medium text-[var(--text-muted)]"
                    />
                  ) : (
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {event.date}
                    </span>
                  )}
                  {isEditMode && (
                    <select
                      value={event.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="text-xs bg-[var(--tag-bg)] border border-[var(--tag-border)] rounded px-2 py-1"
                    >
                      <option value="work">Work</option>
                      <option value="education">Education</option>
                      <option value="achievement">Achievement</option>
                      <option value="certification">Certification</option>
                      <option value="publication">Publication</option>
                    </select>
                  )}
                </div>

                {isEditMode ? (
                  <EditableText
                    path={`timeline.${index}.title`}
                    value={event.title}
                    as="h3"
                    className="text-lg font-semibold text-[var(--foreground)] mb-2"
                  />
                ) : (
                  <h3 className={`text-lg font-semibold mb-2 ${isClickable ? "text-[var(--link-color)]" : "text-[var(--foreground)]"}`}>
                    {event.title}
                  </h3>
                )}

                {isEditMode ? (
                  <EditableMarkdown
                    path={`timeline.${index}.description`}
                    value={event.description}
                    className="text-[var(--foreground)]"
                    compact
                  />
                ) : (
                  <p className="text-[var(--foreground)]">{event.description}</p>
                )}
              </>
            );

            return (
              <div key={event.id} className="relative pl-12">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full ${typeColors[event.type]} flex items-center justify-center text-white shadow-lg`}
                >
                  {typeIcons[event.type]}
                </div>

                {isClickable ? (
                  <Link
                    href={`/post/${postSlug}`}
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
