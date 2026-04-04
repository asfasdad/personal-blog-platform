import type { APIRoute } from "astro";
import { getD1, MediaRepo } from "@/db";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const db = getD1(locals);
  if (!db) {
    return new Response(JSON.stringify({ media: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const items = await MediaRepo.findAll(db, { limit: 100 });
    const media = items.map(item => ({
      id: item.id,
      name: item.filename,
      url: item.url,
      mimeType: item.content_type,
      size: item.size,
      createdAt: item.created_at,
    }));
    return new Response(JSON.stringify({ media }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ media: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = getD1(locals);
  if (!db) {
    return new Response(JSON.stringify({ error: "Database not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

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

    const created = await MediaRepo.create(db, {
      filename: name,
      url,
      content_type: mimeType,
      size: Number.isFinite(size) ? size : 0,
    });

    return new Response(
      JSON.stringify({
        success: true,
        media: created
          ? { id: created.id, name: created.filename, url: created.url, mimeType: created.content_type, size: created.size }
          : null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create media";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
