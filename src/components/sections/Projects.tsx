"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { EditableText, EditableList, useAllSuggestions } from "../EditableText";
import { EditableMarkdown } from "../EditableMarkdown";
import { findPostSlugByProject } from "@/utils/postMatch";

export function Projects() {
  const { data, isEditMode, updateField } = usePortfolio();
  const { allTags } = useAllSuggestions();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProject = () => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name: "New Project",
      description: "Describe your project...",
      link: "https://github.com/username/project",
      stars: 0,
      technologies: ["Technology"],
    };
    updateField("projects", [...data.projects, newProject]);
    setShowAddForm(false);
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    updateField("projects", newProjects);
  };

  return (
    <section id="projects" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          Projects
        </h2>
        {isEditMode && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.projects.map((project, index) => {
          const postSlug = findPostSlugByProject(data.posts || [], project);
          const isClickable = !isEditMode && postSlug;

          const cardContent = (
            <>
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveProject(index);
                  }}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10"
                  title="Remove"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              <div className="flex items-start justify-between mb-3">
                {!isEditMode ? (
                  <h3 className="text-xl font-semibold text-[var(--link-color)]">
                    {project.name}
                  </h3>
                ) : (
                  <EditableText
                    path={`projects.${index}.name`}
                    value={project.name}
                    as="h3"
                    className="text-xl font-semibold text-[var(--foreground)]"
                  />
                )}
                {project.stars !== undefined && project.stars > 0 && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-medium">{project.stars}</span>
                  </div>
                )}
              </div>

              <EditableMarkdown
                path={`projects.${index}.description`}
                value={project.description}
                className="text-[var(--foreground)] mb-4"
              />

              <EditableList
                path={`projects.${index}.technologies`}
                items={project.technologies}
                className="mb-4"
                itemClassName="bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-full text-sm"
                suggestions={allTags}
              />

              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.link, "_blank");
                }}
                className="inline-flex items-center gap-2 text-[var(--link-color)] hover:underline cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </span>
            </>
          );

          if (isClickable) {
            return (
              <Link
                key={project.id}
                href={`/post/${postSlug}`}
                className="relative block rounded-xl p-6 card-clickable"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div
              key={project.id}
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
              Add New Project
            </h3>
            <p className="text-[var(--foreground)] mb-4">
              A new project entry will be added. You can edit the details after adding.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--tag-bg)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
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
