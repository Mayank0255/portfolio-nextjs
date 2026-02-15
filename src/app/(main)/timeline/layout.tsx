import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Chronological timeline of Mayank Aggarwal's career journey — education, work experience, achievements, and certifications.",
  alternates: { canonical: "https://mayankaggarwal.com/timeline" },
  openGraph: {
    title: "Timeline | Mayank Aggarwal",
    description: "Career timeline: education, work, achievements, and certifications.",
    url: "https://mayankaggarwal.com/timeline",
  },
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
