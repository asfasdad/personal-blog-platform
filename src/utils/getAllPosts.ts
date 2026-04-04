/**
 * Unified post reading layer
 *
 * Merges posts from Astro Content Collections (Markdown files)
 * with posts stored in Cloudflare D1 database (created via admin).
 */

import { getCollection, type CollectionEntry } from "astro:content";
import type { DbPost } from "@/db";
import { PostsRepo, getD1 } from "@/db";
import getSortedPosts from "./getSortedPosts";

export interface UnifiedPost {
  source: "markdown" | "db";
  slug: string;
  title: string;
  description: string;
  content?: string;
  tags: string[];
  author: string;
  draft: boolean;
  featured: boolean;
  pubDatetime: Date;
  modDatetime: Date | null;
}

function mdPostToUnified(post: CollectionEntry<"blog">): UnifiedPost {
  return {
    source: "markdown",
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    author: post.data.author,
    draft: post.data.draft ?? false,
    featured: post.data.featured ?? false,
    pubDatetime: new Date(post.data.pubDatetime),
    modDatetime: post.data.modDatetime ? new Date(post.data.modDatetime) : null,
  };
}

function dbPostToUnified(post: DbPost): UnifiedPost {
  let tags: string[] = [];
  if (post.tags) {
    try {
      tags = JSON.parse(post.tags);
    } catch {
      tags = post.tags.split(",").map(t => t.trim()).filter(Boolean);
    }
  }

  return {
    source: "db",
    slug: post.slug,
    title: post.title,
    description: post.description ?? "",
    content: post.content,
    tags,
    author: post.author ?? "Author Name",
    draft: post.draft === 1,
    featured: post.featured === 1,
    pubDatetime: new Date(post.pub_datetime),
    modDatetime: post.mod_datetime ? new Date(post.mod_datetime) : null,
  };
}

/**
 * Get all posts from both Markdown files and D1 database,
 * merged, deduplicated by slug, and sorted by date descending.
 */
export async function getAllPosts(
  locals?: App.Locals,
  opts?: { includeDrafts?: boolean }
): Promise<UnifiedPost[]> {
  // 1. Get Markdown posts
  const mdPosts = await getCollection("blog");
  const sortedMd = getSortedPosts(mdPosts);
  const mdUnified = sortedMd.map(mdPostToUnified);

  // 2. Get D1 posts if available
  let dbUnified: UnifiedPost[] = [];
  if (locals) {
    const db = getD1(locals);
    if (db) {
      try {
        const dbPosts = await PostsRepo.findAll(db);
        dbUnified = dbPosts.map(dbPostToUnified);
      } catch {
        // D1 not available, continue with markdown only
      }
    }
  }

  // 3. Merge and deduplicate (markdown takes precedence for same slug)
  const slugSet = new Set(mdUnified.map(p => p.slug));
  const merged = [
    ...mdUnified,
    ...dbUnified.filter(p => !slugSet.has(p.slug)),
  ];

  // 4. Filter drafts unless explicitly included
  const filtered = opts?.includeDrafts
    ? merged
    : merged.filter(p => !p.draft);

  // 5. Sort by pubDatetime descending
  return filtered.sort(
    (a, b) => b.pubDatetime.getTime() - a.pubDatetime.getTime()
  );
}

/**
 * Get all unique tags from unified posts
 */
export async function getAllTags(locals?: App.Locals): Promise<string[]> {
  const posts = await getAllPosts(locals);
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
