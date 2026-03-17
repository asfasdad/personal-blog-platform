import type { APIRoute } from "astro";
import { buildStats } from "@/lib/admin-store";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const stats = await buildStats(locals);
  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
