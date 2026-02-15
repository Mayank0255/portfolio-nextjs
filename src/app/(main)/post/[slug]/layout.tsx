import { Metadata } from "next";
import { getPortfolioData } from "@/lib/getPortfolioData";

const SITE_URL = "https://mayankaggarwal.com";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const data = await getPortfolioData();
  const post = data.posts?.find((p) => p.slug === decodedSlug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const description = post.description || post.content.slice(0, 160).replace(/[#*_\n]/g, "").trim();
  const postUrl = `${SITE_URL}/post/${encodeURIComponent(post.slug)}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: postUrl,
      publishedTime: post.date,
      authors: ["Mayank Aggarwal"],
      tags: post.tags,
      ...(post.image?.src && {
        images: [{ url: post.image.src, alt: post.image.alt || post.title }],
      }),
    },
    twitter: {
      card: post.image?.src ? "summary_large_image" : "summary",
      title: post.title,
      description,
      ...(post.image?.src && { images: [post.image.src] }),
    },
  };
}

// JSON-LD for BlogPosting
async function PostJsonLd({ slug }: { slug: string }) {
  const decodedSlug = decodeURIComponent(slug);
  const data = await getPortfolioData();
  const post = data.posts?.find((p) => p.slug === decodedSlug);

  if (!post) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || post.content.slice(0, 160).replace(/[#*_\n]/g, "").trim(),
    datePublished: post.date,
    url: `${SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    author: {
      "@type": "Person",
      name: "Mayank Aggarwal",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Mayank Aggarwal",
      url: SITE_URL,
    },
    keywords: post.tags?.join(", "),
    ...(post.image?.src && { image: post.image.src }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PostLayout({ params, children }: Props) {
  const { slug } = await params;
  return (
    <>
      <PostJsonLd slug={slug} />
      {children}
    </>
  );
}
