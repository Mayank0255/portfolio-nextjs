import { NextRequest, NextResponse } from "next/server";

interface RepoStats {
  owner: string;
  repo: string;
  stars: number;
  forks: number;
  error?: string;
}

// Simple in-memory cache: { key -> { data, expiry } }
const cache = new Map<string, { data: RepoStats; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchRepoStats(owner: string, repo: string): Promise<RepoStats> {
  const key = `${owner}/${repo}`;
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "portfolio-app",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { owner, repo, stars: 0, forks: 0, error: `GitHub API ${res.status}` };
    }

    const data = await res.json();
    const stats: RepoStats = {
      owner,
      repo,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    };

    cache.set(key, { data: stats, expiry: Date.now() + CACHE_TTL });
    return stats;
  } catch {
    return { owner, repo, stars: 0, forks: 0, error: "Failed to fetch" };
  }
}

/** Parse "https://github.com/owner/repo" into { owner, repo } */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

// GET /api/github?repos=owner1/repo1,owner2/repo2
// OR /api/github?urls=https://github.com/o/r,https://github.com/o2/r2
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repos = searchParams.get("repos");
  const urls = searchParams.get("urls");

  const pairs: { owner: string; repo: string }[] = [];

  if (repos) {
    for (const r of repos.split(",")) {
      const parts = r.trim().split("/");
      if (parts.length === 2) {
        pairs.push({ owner: parts[0], repo: parts[1] });
      }
    }
  }

  if (urls) {
    for (const u of urls.split(",")) {
      const parsed = parseGitHubUrl(u.trim());
      if (parsed) pairs.push(parsed);
    }
  }

  if (pairs.length === 0) {
    return NextResponse.json({ error: "Provide repos or urls param" }, { status: 400 });
  }

  const results = await Promise.all(
    pairs.map(({ owner, repo }) => fetchRepoStats(owner, repo))
  );

  // Return as a map keyed by "owner/repo"
  const statsMap: Record<string, { stars: number; forks: number }> = {};
  for (const r of results) {
    statsMap[`${r.owner}/${r.repo}`] = { stars: r.stars, forks: r.forks };
  }

  return NextResponse.json(statsMap, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
