"use client";

import { useEffect } from "react";

export default function CVPage() {
  useEffect(() => {
    window.location.href = "/pdf/cv.pdf";
  }, []);
  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
      <p className="text-[var(--text-muted)]">Redirecting to CV...</p>
    </div>
  );
}
