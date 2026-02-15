import { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/getPortfolioData";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mayankaggarwal.com";
  const data = await getPortfolioData();
  const posts = data.posts || [];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/activities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/topics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/timeline`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/cv`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Category pages
  const categories = new Set<string>();
  for (const post of posts) {
    for (const cat of post.categories || []) {
      if (cat.trim()) categories.add(cat.trim());
    }
  }
  const categoryPages: MetadataRoute.Sitemap = Array.from(categories).map((cat) => ({
    url: `${baseUrl}/categories/${encodeURIComponent(slugify(cat))}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Tag pages
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags || []) {
      if (tag.trim()) tags.add(tag.trim());
    }
  }
  const tagPages: MetadataRoute.Sitemap = Array.from(tags).map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(slugify(tag))}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
