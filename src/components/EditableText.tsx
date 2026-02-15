"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

interface EditableTextProps {
  path: string;
  value: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  path,
  value,
  as: Component = "span",
  className = "",
  multiline = false,
  placeholder = "Click to edit...",
}: EditableTextProps) {
  const { isEditMode, updateField } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateField(path, editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    }
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    const inputClassName = `w-full bg-[var(--input-bg)] text-[var(--foreground)] border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`;

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${inputClassName} min-h-[100px] resize-y`}
          placeholder={placeholder}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={inputClassName}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Component
      className={`${className} cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded px-1 -mx-1 transition-colors border border-dashed border-transparent hover:border-blue-400`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
    </Component>
  );
}

// --- SuggestionInput: input with autocomplete dropdown ---

interface SuggestionInputProps {
  value?: string;
  onChange?: (v: string) => void;
  onSelect: (v: string) => void;
  suggestions: string[];
  exclude?: string[];
  placeholder?: string;
  className?: string;
}

export function SuggestionInput({
  value: externalValue,
  onChange: externalOnChange,
  onSelect,
  suggestions,
  exclude = [],
  placeholder,
  className,
}: SuggestionInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = (v: string) => {
    if (externalOnChange) externalOnChange(v);
    else setInternalValue(v);
  };

  const excludeSet = new Set(exclude.map((e) => e.toLowerCase()));
  const filtered = suggestions.filter((s) => {
    if (excludeSet.has(s.toLowerCase())) return false;
    if (!value.trim()) return true;
    return s.toLowerCase().includes(value.toLowerCase());
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightIdx(-1);
  }, [value]);

  const handleSelect = (v: string) => {
    onSelect(v);
    setValue("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIdx >= 0 && filtered[highlightIdx]) {
        handleSelect(filtered[highlightIdx]);
      } else if (value.trim()) {
        handleSelect(value.trim());
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg z-50">
          {filtered.slice(0, 15).map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm text-[var(--foreground)] transition-colors ${
                i === highlightIdx
                  ? "bg-[var(--link-color)] text-white"
                  : "hover:bg-[var(--tag-bg)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Hook: collect all unique tags & categories from posts ---

export function useAllSuggestions() {
  const { data } = usePortfolio();
  const posts = data.posts || [];

  const allTags = useCallback(() => {
    const set = new Set<string>();
    for (const p of posts) {
      for (const t of p.tags || []) set.add(t);
    }
    return Array.from(set).sort();
  }, [posts]);

  const allCategories = useCallback(() => {
    const set = new Set<string>();
    for (const p of posts) {
      for (const c of p.categories || []) set.add(c);
    }
    return Array.from(set).sort();
  }, [posts]);

  return { allTags: allTags(), allCategories: allCategories() };
}

// --- EditableList with optional suggestions ---

interface EditableListProps {
  path: string;
  items: string[];
  className?: string;
  itemClassName?: string;
  suggestions?: string[];
}

export function EditableList({
  path,
  items,
  className = "",
  itemClassName = "",
  suggestions,
}: EditableListProps) {
  const { isEditMode, updateField } = usePortfolio();
  const [newItem, setNewItem] = useState("");

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateField(path, newItems);
  };

  const handleAdd = (value?: string) => {
    const v = (value || newItem).trim();
    if (v && !items.some((item) => item.toLowerCase() === v.toLowerCase())) {
      updateField(path, [...items, v]);
      setNewItem("");
    }
  };

  const handleUpdate = (index: number, value: string) => {
    const v = value.trim();
    if (v && items.some((item, i) => i !== index && item.toLowerCase() === v.toLowerCase())) {
      return; // prevent duplicate
    }
    const newItems = [...items];
    newItems[index] = value;
    updateField(path, newItems);
  };

  if (!isEditMode) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {items.map((item, index) => (
          <span key={index} className={itemClassName}>
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1 group">
          <input
            type="text"
            value={item}
            onChange={(e) => handleUpdate(index, e.target.value)}
            className={`${itemClassName} bg-transparent border border-dashed border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={() => handleRemove(index)}
            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <div className="flex items-center gap-1">
        {suggestions ? (
          <SuggestionInput
            value={newItem}
            onChange={setNewItem}
            onSelect={(v) => handleAdd(v)}
            suggestions={suggestions}
            exclude={items}
            placeholder="Add..."
            className="bg-transparent border border-dashed border-green-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-32"
          />
        ) : (
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add new..."
            className="bg-transparent border border-dashed border-green-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        )}
        <button
          onClick={() => handleAdd()}
          className="text-green-500 hover:text-green-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
