import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Explore topics and tags across Mayank Aggarwal's portfolio — Golang, React, distributed systems, ad tech, and more.",
  alternates: { canonical: "https://mayankaggarwal.com/topics" },
  openGraph: {
    title: "Topics | Mayank Aggarwal",
    description: "Browse all topics and tags from Mayank Aggarwal's portfolio.",
    url: "https://mayankaggarwal.com/topics",
  },
};

export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
