#!/usr/bin/env node
/**
 * Ingest Jekyll _posts into posts.json for the portfolio app.
 * Run from repo root: node scripts/ingest-posts.mjs
 * Expects mayank0255.github.io at ../mayank0255.github.io
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const postsDir = path.resolve(root, "..", "mayank0255.github.io", "_posts");
const outPath = path.join(root, "src", "data", "posts.json");

function slugFromFilename(filename) {
  const base = path.basename(filename, ".md");
  const withoutDate = base.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return withoutDate;
}

function dateFromFilename(filename) {
  const base = path.basename(filename, ".md");
  const match = base.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function parseFrontmatter(raw) {
  const result = {};
  let inArray = null;
  let arrayKey = null;
  let arrayAcc = [];

  const lines = raw.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inArray) {
      if (line.match(/^\s*\]\s*$/)) {
        result[arrayKey] = arrayAcc;
        inArray = null;
        arrayKey = null;
        arrayAcc = [];
      } else {
        const trimmed = line.trim().replace(/^["']|["']\s*,?\s*$|,\s*$/g, "").trim();
        if (trimmed) arrayAcc.push(trimmed);
      }
      continue;
    }
    const titleMatch = line.match(/^title:\s*["']?(.+?)["']?\s*$/);
    if (titleMatch) {
      result.title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    const descMatch = line.match(/^description:\s*["']?(.+?)["']?\s*$/);
    if (descMatch) {
      result.description = descMatch[1].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    const pinMatch = line.match(/^pin:\s*(true|false)\s*$/);
    if (pinMatch) {
      result.pin = pinMatch[1] === "true";
      continue;
    }
    const workTimeMatch = line.match(/^work_time:\s*["']?(.+?)["']?\s*$/);
    if (workTimeMatch) {
      result.workTime = workTimeMatch[1].trim().replace(/^["']|["']$/g, "");
      continue;
    }
    const categoriesStart = line.match(/^categories:\s*\[\s*$/);
    if (categoriesStart) {
      inArray = true;
      arrayKey = "categories";
      arrayAcc = [];
      continue;
    }
    const categoriesInline = line.match(/^categories:\s*\[(.+)\]\s*$/);
    if (categoriesInline) {
      result.categories = categoriesInline[1]
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    const tagsStart = line.match(/^tags:\s*\[\s*$/);
    if (tagsStart) {
      inArray = true;
      arrayKey = "tags";
      arrayAcc = [];
      continue;
    }
  }
  if (!result.categories) result.categories = [];
  if (!result.tags) result.tags = [];
  return result;
}

function parsePost(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const delim = "\n---\n";
  const idx = content.indexOf(delim);
  if (idx === -1) return null;
  const frontRaw = content.slice(0, idx).replace(/^---\n?/, "").trim();
  const body = content.slice(idx + delim.length).trim();
  const front = parseFrontmatter(frontRaw);
  const filename = path.basename(filePath);
  const slug = slugFromFilename(filename);
  const date = dateFromFilename(filename);
  return {
    id: slug,
    slug,
    title: front.title || slug,
    description: front.description || "",
    content: body,
    date,
    categories: Array.isArray(front.categories) ? front.categories : [],
    tags: Array.isArray(front.tags) ? front.tags : [],
    pin: !!front.pin,
    workTime: front.workTime,
    image: front.image,
  };
}

if (!fs.existsSync(postsDir)) {
  console.warn("Jekyll _posts not found at", postsDir, "- writing empty posts.json");
  fs.writeFileSync(outPath, JSON.stringify([], null, 2));
  process.exit(0);
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
const posts = [];
for (const f of files) {
  try {
    const post = parsePost(path.join(postsDir, f));
    if (post) posts.push(post);
  } catch (e) {
    console.warn("Skip", f, e.message);
  }
}
posts.sort((a, b) => (b.date < a.date ? -1 : 1));
fs.writeFileSync(outPath, JSON.stringify(posts, null, 2));
console.log("Wrote", posts.length, "posts to", outPath);
