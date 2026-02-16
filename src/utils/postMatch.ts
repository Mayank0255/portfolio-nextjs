import type { Post } from "@/data/portfolio";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/** Find a post slug for an experience entry (role + company). */
export function findPostSlugByExperience(
  posts: Post[],
  exp: { role: string; company: string }
): string | null {
  const needle = `${exp.role} at ${exp.company}`;
  const normalizedNeedle = normalizeForMatch(needle);
  const slugNeedle = slugify(needle);
  for (const p of posts) {
    const t = normalizeForMatch(p.title);
    if (t === normalizedNeedle || slugify(p.title) === slugNeedle) return p.slug;
    if (t.includes(normalizedNeedle) || normalizedNeedle.includes(t)) return p.slug;
  }
  return null;
}

/** Find a post slug for a project (by name). */
export function findPostSlugByProject(
  posts: Post[],
  project: { name: string }
): string | null {
  const name = project.name.trim();
  const normalizedName = normalizeForMatch(name);
  const slugName = slugify(name);
  for (const p of posts) {
    const t = normalizeForMatch(p.title);
    if (slugify(p.title) === slugName || t === normalizedName) return p.slug;
    if (t.includes(normalizedName) || normalizedName.includes(t)) return p.slug;
  }
  return null;
}

/** Find a project entry matching a post (reverse of findPostSlugByProject). */
export function findProjectByPost(
  projects: { name: string; link: string; stars?: number }[],
  post: Post
): { name: string; link: string; stars?: number } | null {
  const postTitle = normalizeForMatch(post.title);
  const postSlug = slugify(post.title);
  for (const proj of projects) {
    const projName = normalizeForMatch(proj.name);
    const projSlug = slugify(proj.name);
    if (projSlug === postSlug || projName === postTitle) return proj;
    if (postTitle.includes(projName) || projName.includes(postTitle)) return proj;
  }
  return null;
}

/** Find a post slug for a timeline event (by title, optionally date). */
export function findPostSlugByTimelineEvent(
  posts: Post[],
  event: { title: string; date?: string }
): string | null {
  const title = event.title.trim();
  const normalizedTitle = normalizeForMatch(title);
  const slugTitle = slugify(title);
  for (const p of posts) {
    const t = normalizeForMatch(p.title);
    if (slugify(p.title) === slugTitle || t === normalizedTitle) return p.slug;
    if (t.includes(normalizedTitle) || normalizedTitle.includes(t)) return p.slug;
  }
  return null;
}
