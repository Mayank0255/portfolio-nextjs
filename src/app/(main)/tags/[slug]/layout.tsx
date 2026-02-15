import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `#${tag}`,
    description: `Browse all posts tagged with "${tag}" by Mayank Aggarwal.`,
    alternates: { canonical: `https://mayankaggarwal.com/tags/${slug}` },
    openGraph: {
      title: `#${tag} | Mayank Aggarwal`,
      description: `Posts tagged with "${tag}".`,
      url: `https://mayankaggarwal.com/tags/${slug}`,
    },
  };
}

export default function TagLayout({ children }: Props) {
  return children;
}
