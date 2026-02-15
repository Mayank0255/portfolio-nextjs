"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { formatTimelineDate } from "@/components/sections/timelineStyles";

export function SearchBar() {
  const { data } = usePortfolio();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const posts = data.posts || [];
  const results = query.trim().length < 2
    ? []
    : posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.content || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          (p.categories || []).some((c) => c.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results.length, query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSelectedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const onSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      setSelectedIndex(-1);
      router.push(`/post/${slug}`);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            onSelect(results[selectedIndex].slug);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [open, results, selectedIndex, onSelect]
  );

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <div className="flex items-center gap-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] px-4 py-2.5 shadow-sm hover:border-[var(--link-color)]/50 focus-within:border-[var(--link-color)] focus-within:ring-2 focus-within:ring-[var(--link-color)]/20 transition-all">
        <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search posts, tags, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-1 text-[var(--foreground)] placeholder-[var(--text-muted)]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
              setSelectedIndex(-1);
            }}
            className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {open && (query.trim().length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl z-50 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-4 text-[var(--text-muted)] text-sm text-center">No results found</p>
          ) : (
            <ul ref={listRef} role="listbox">
              {results.map((p, index) => (
                <li key={p.id} role="option" aria-selected={index === selectedIndex}>
                  <button
                    type="button"
                    onClick={() => onSelect(p.slug)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-3 border-b border-[var(--border-color)] last:border-b-0 transition-colors ${
                      index === selectedIndex
                        ? "bg-[var(--link-color)]/10 border-l-2 border-l-[var(--link-color)]"
                        : "hover:bg-[var(--tag-bg)]"
                    }`}
                  >
                    <span className={`font-medium block ${index === selectedIndex ? "text-[var(--link-color)]" : "text-[var(--foreground)]"}`}>
                      {p.title}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{formatTimelineDate(p.date)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
