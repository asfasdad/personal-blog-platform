import type { APIRoute } from "astro";
import { getD1, PostsRepo } from "@/db";
import { getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = getD1(locals);
  const mdPosts = await getCollection("blog");

  let dbTotal = 0;
  let dbPublished = 0;
  let dbDrafts = 0;

  if (db) {
    try {
      [dbTotal, dbPublished, dbDrafts] = await Promise.all([
        PostsRepo.count(db),
        PostsRepo.count(db, { draft: false }),
        PostsRepo.count(db, { draft: true }),
      ]);
    } catch { /* D1 not available */ }
  }

  const mdTotal = mdPosts.length;
  const mdPublished = mdPosts.filter(p => !p.data.draft).length;

  return new Response(
    JSON.stringify({
      totalPosts: mdTotal + dbTotal,
      publishedPosts: mdPublished + dbPublished,
      draftPosts: (mdTotal - mdPublished) + dbDrafts,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
