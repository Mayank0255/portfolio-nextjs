import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Browse Mayank Aggarwal's professional activities grouped by category — work experience, projects, certifications, and more.",
  alternates: { canonical: "https://mayankaggarwal.com/activities" },
  openGraph: {
    title: "Activities | Mayank Aggarwal",
    description: "Professional activities and posts grouped by category.",
    url: "https://mayankaggarwal.com/activities",
  },
};

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
