import type { APIRoute } from "astro";
import { getD1, PostsRepo } from "@/db";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getD1(locals);

    let totalPosts = 0;
    let publishedPosts = 0;
    let draftPosts = 0;
    let thisMonth = 0;

    if (db) {
      [totalPosts, publishedPosts, draftPosts, thisMonth] = await Promise.all([
        PostsRepo.count(db),
        PostsRepo.count(db, { draft: false }),
        PostsRepo.count(db, { draft: true }),
        PostsRepo.countThisMonth(db),
      ]);
    }

    return new Response(
      JSON.stringify({
        totalPosts,
        publishedPosts,
        draftPosts,
        thisMonth,
        latestDeploy: "cloudflare: success",
        audit: [
          { timestamp: new Date().toISOString(), action: "status-refresh", status: "ok" },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get status";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
