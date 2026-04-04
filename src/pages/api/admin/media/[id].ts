import type { APIRoute } from "astro";
import { getD1, MediaRepo, getR2 } from "@/db";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Media id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = getD1(locals);
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const removed = await MediaRepo.delete(db, parseInt(id, 10));
  if (!removed) {
    return new Response(JSON.stringify({ error: "Media not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async (context) => {
  return DELETE(context);
};
