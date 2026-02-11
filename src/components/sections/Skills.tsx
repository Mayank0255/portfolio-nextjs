"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { EditableText, EditableList } from "../EditableText";
import { slugify } from "@/utils/postMatch";

export function Skills() {
  const { data, isEditMode, updateField } = usePortfolio();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = () => {
    const newCategory = {
      category: "New Category",
      items: ["Skill 1", "Skill 2"],
    };
    updateField("skills", [...data.skills, newCategory]);
    setShowAddForm(false);
  };

  const handleRemoveCategory = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    updateField("skills", newSkills);
  };

  return (
    <section id="skills" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          Skills
        </h2>
        {isEditMode && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.skills.map((skillGroup, index) => (
          <div
            key={index}
            className="relative card-surface rounded-xl p-6"
          >
            {isEditMode && (
              <button
                onClick={() => handleRemoveCategory(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                title="Remove"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            <EditableText
              path={`skills.${index}.category`}
              value={skillGroup.category}
              as="h3"
              className="text-lg font-semibold text-[var(--foreground)] mb-4"
            />

            {!isEditMode ? (
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((item, i) => (
                  <Link
                    key={i}
                    href={`/tags/${slugify(item)}`}
                    className="bg-gradient-to-r bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ) : (
              <EditableList
                path={`skills.${index}.items`}
                items={skillGroup.items}
                itemClassName="bg-gradient-to-r bg-[var(--tag-bg)] text-[var(--tag-fg)] border border-[var(--tag-border)] px-3 py-1 rounded-lg text-sm font-medium"
              />
            )}
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card-surface rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
              Add New Skill Category
            </h3>
            <p className="text-[var(--foreground)] mb-4">
              A new skill category will be added. You can edit the name and skills after adding.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-[var(--foreground)] hover:bg-[var(--tag-bg)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
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
