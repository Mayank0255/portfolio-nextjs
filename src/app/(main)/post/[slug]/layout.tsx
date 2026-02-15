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
      modifiedTime: post.date,
      authors: ["Mayank Aggarwal"],
      tags: post.tags,
      section: post.categories?.[0],
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

// Strip markdown to plain text for articleBody
function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// JSON-LD: BlogPosting + BreadcrumbList
async function PostJsonLd({ slug }: { slug: string }) {
  const decodedSlug = decodeURIComponent(slug);
  const data = await getPortfolioData();
  const post = data.posts?.find((p) => p.slug === decodedSlug);

  if (!post) return null;

  const postUrl = `${SITE_URL}/post/${encodeURIComponent(post.slug)}`;
  const plainContent = stripMarkdown(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": postUrl,
        headline: post.title,
        description:
          post.description || post.content.slice(0, 160).replace(/[#*_\n]/g, "").trim(),
        articleBody: plainContent.slice(0, 5000),
        datePublished: post.date,
        dateModified: post.date,
        url: postUrl,
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: "Mayank Aggarwal",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: "Mayank Aggarwal",
          url: SITE_URL,
        },
        keywords: post.tags?.join(", "),
        articleSection: post.categories?.join(", "),
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        ...(post.image?.src && {
          image: {
            "@type": "ImageObject",
            url: post.image.src,
            caption: post.image.alt || post.title,
          },
        }),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: post.title,
            item: postUrl,
          },
        ],
      },
    ],
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
