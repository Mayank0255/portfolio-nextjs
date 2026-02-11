"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { markdownToHtml, markdownProseClass } from "@/lib/markdown";

interface EditableMarkdownProps {
  path: string;
  value: string;
  className?: string;
  placeholder?: string;
  /** Compact: single-line feel in view mode when content is short */
  compact?: boolean;
}

export function EditableMarkdown({
  path,
  value,
  className = "",
  placeholder = "Click to edit... (Markdown supported)",
  compact = false,
}: EditableMarkdownProps) {
  const { isEditMode, updateField } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateField(path, editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  // View mode: always render as markdown
  if (!isEditMode) {
    const html = markdownToHtml(value || "");
    const isEmpty = !value || !value.trim();
    return (
      <div
        className={`${markdownProseClass} ${className} ${compact ? "prose-sm" : ""}`}
        dangerouslySetInnerHTML={{ __html: isEmpty ? `<p class="text-[var(--text-muted)] italic">${placeholder}</p>` : html }}
      />
    );
  }

  // Edit mode, editing: raw textarea + preview
  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Raw Markdown Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-[var(--foreground)]">
              Raw Markdown
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="text-xs px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setEditValue(value); setIsEditing(false); }}
                className="text-xs px-3 py-1.5 rounded border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--tag-bg)] font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[150px] rounded-lg border-2 border-blue-500 bg-[var(--input-bg)] text-[var(--foreground)] p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Supports: **bold**, *italic*, `code`, [links](url), # headings, - lists, ```code blocks```
          </p>
        </div>

        {/* Live Preview */}
        <div>
          <label className="text-sm font-semibold text-[var(--foreground)] mb-2 block">
            Live Preview
          </label>
          <div
            className={`rounded-lg border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-4 ${markdownProseClass}`}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(editValue) || "<p class=\"text-[var(--text-muted)] italic\">Start typing to see preview...</p>" }}
          />
        </div>
      </div>
    );
  }

  // Edit mode, not editing: show rendered markdown, click to edit
  const html = markdownToHtml(value || "");
  const isEmpty = !value || !value.trim();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
      className={`cursor-pointer rounded border border-dashed border-transparent hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors p-2 -m-2 ${markdownProseClass} ${className}`}
      title="Click to edit"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: isEmpty
            ? `<p class="text-[var(--text-muted)] italic">${placeholder}</p>`
            : html,
        }}
      />
    </div>
  );
}
