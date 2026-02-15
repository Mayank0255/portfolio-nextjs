import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: category,
    description: `Browse all posts in the "${category}" category by Mayank Aggarwal.`,
    alternates: { canonical: `https://mayankaggarwal.com/categories/${slug}` },
    openGraph: {
      title: `${category} | Mayank Aggarwal`,
      description: `Posts categorized under "${category}".`,
      url: `https://mayankaggarwal.com/categories/${slug}`,
    },
  };
}

export default function CategoryLayout({ children }: Props) {
  return children;
}
