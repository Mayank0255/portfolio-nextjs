"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { EditableMarkdown } from "../EditableMarkdown";

export function About() {
  const { data } = usePortfolio();

  return (
    <section id="home" className="mb-16">
      <h2 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
        About Me
      </h2>
      <div className="about-inline-icons">
        <EditableMarkdown
          path="about"
          value={data.about}
          className="text-[var(--foreground)] leading-relaxed opacity-95"
          placeholder="About you... (Markdown supported)"
        />
      </div>
    </section>
  );
}
