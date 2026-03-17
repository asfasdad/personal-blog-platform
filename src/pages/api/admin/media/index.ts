import type { APIRoute } from "astro";
import { addMedia, listMedia } from "@/lib/admin-store";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const media = await listMedia(locals);
  return new Response(JSON.stringify({ media }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = (await request.json()) as {
      name?: string;
      url?: string;
      mimeType?: string;
      size?: number;
    };

    const name = String(data.name ?? "").trim();
    const url = String(data.url ?? "").trim();
    const mimeType = String(data.mimeType ?? "application/octet-stream").trim();
    const size = Number(data.size ?? 0);

    if (!name || !url) {
      return new Response(JSON.stringify({ error: "name and url are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const created = await addMedia(locals, {
      name,
      url,
      mimeType,
      size: Number.isFinite(size) ? size : 0,
    });

    return new Response(JSON.stringify({ success: true, media: created }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating media:", error);
    return new Response(JSON.stringify({ error: "Failed to create media" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
