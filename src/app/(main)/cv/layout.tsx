import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Download Mayank Aggarwal's resume — Software Development Engineer at Zomato.",
  alternates: { canonical: "https://mayankaggarwal.com/cv" },
  openGraph: {
    title: "CV | Mayank Aggarwal",
    description: "Download Mayank Aggarwal's professional resume.",
    url: "https://mayankaggarwal.com/cv",
  },
};

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return children;
}
