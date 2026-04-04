import type { APIRoute } from "astro";
import { getD1, PostsRepo } from "@/db";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = getD1(locals);
  if (!db) {
    return new Response(JSON.stringify({ posts: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const posts = await PostsRepo.findAll(db);
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ posts: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
