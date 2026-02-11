"use client";

import { SearchBar } from "./SearchBar";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="flex items-center justify-center px-6 py-3 md:py-4">
        {/* Spacer for mobile menu button */}
        <div className="w-12 md:hidden" />

        {/* Centered search */}
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <SearchBar />
        </div>

        {/* Spacer for balance */}
        <div className="w-12 md:hidden" />
      </div>
    </header>
  );
}
