import type { APIRoute } from "astro";
import { listPosts } from "@/lib/admin-store";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const posts = await listPosts(locals);
  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
