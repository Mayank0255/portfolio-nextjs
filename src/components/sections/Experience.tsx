"use client";

import { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { EditableText, EditableList } from "../EditableText";
import { EditableMarkdown } from "../EditableMarkdown";
import { findPostSlugByExperience } from "@/utils/postMatch";

export function Experience() {
  const { data, isEditMode, updateField } = usePortfolio();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: "New Company",
      role: "Role Title",
      period: "2024 - Present",
      workType: "Full-Time",
      description: "Describe your role and achievements...",
      technologies: ["Technology"],
    };
    updateField("experience", [...data.experience, newExp]);
    setShowAddForm(false);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    updateField("experience", newExperience);
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
        {data.experience.map((exp, index) => {
          const postSlug = findPostSlugByExperience(data.posts || [], exp);
          const isClickable = !isEditMode && postSlug;

          const cardContent = (
            <>
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveExperience(index);
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
                  {!isEditMode ? (
                    <h3 className="text-xl font-semibold text-[var(--link-color)]">
                      {exp.role}
                    </h3>
                  ) : (
                    <EditableText
                      path={`experience.${index}.role`}
                      value={exp.role}
                      as="h3"
                      className="text-xl font-semibold text-[var(--foreground)]"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <EditableText
                      path={`experience.${index}.company`}
                      value={exp.company}
                      as="span"
                      className="text-[var(--link-color)] font-medium"
                    />
                    {exp.workType && (
                      <>
                        <span className="text-[var(--text-muted)]">&bull;</span>
                        <EditableText
                          path={`experience.${index}.workType`}
                          value={exp.workType}
                          as="span"
                          className="text-[var(--text-muted)] text-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
                <EditableText
                  path={`experience.${index}.period`}
                  value={exp.period}
                  as="span"
                  className="text-[var(--text-muted)] text-sm mt-2 md:mt-0 whitespace-nowrap"
                />
              </div>

              <EditableMarkdown
                path={`experience.${index}.description`}
                value={exp.description}
                className="text-[var(--foreground)] mb-4"
              />

              <EditableList
                path={`experience.${index}.technologies`}
                items={exp.technologies}
                className="mt-4"
                itemClassName="bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-full text-sm"
              />
            </>
          );

          if (isClickable) {
            return (
              <Link
                key={exp.id}
                href={`/post/${postSlug}`}
                className="relative block rounded-xl p-6 card-clickable"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div
              key={exp.id}
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
