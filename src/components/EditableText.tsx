"use client";

import React, { useState, useRef, useEffect } from "react";
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

interface EditableListProps {
  path: string;
  items: string[];
  className?: string;
  itemClassName?: string;
}

export function EditableList({ path, items, className = "", itemClassName = "" }: EditableListProps) {
  const { isEditMode, updateField } = usePortfolio();
  const [newItem, setNewItem] = useState("");

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateField(path, newItems);
  };

  const handleAdd = () => {
    if (newItem.trim()) {
      updateField(path, [...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleUpdate = (index: number, value: string) => {
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
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add new..."
          className="bg-transparent border border-dashed border-green-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleAdd}
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
