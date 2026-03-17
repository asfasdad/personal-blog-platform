import type { APIRoute } from "astro";
import { removeMedia } from "@/lib/admin-store";

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Media id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const removed = await removeMedia(locals, id);
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
