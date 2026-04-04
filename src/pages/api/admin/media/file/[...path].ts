import type { APIRoute } from "astro";
import { getR2 } from "@/db";

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const r2 = getR2(locals);
    if (!r2) {
      return new Response("Storage not available", { status: 503 });
    }

    // Reconstruct the key from the catch-all param
    const key = params.path;
    if (!key) {
      return new Response("File not found", { status: 404 });
    }

    const object = await r2.get(key);
    if (!object) {
      return new Response("File not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    if (object.size) {
      headers.set("Content-Length", object.size.toString());
    }

    return new Response(object.body as ReadableStream, { headers });
  } catch {
    return new Response("Error reading file", { status: 500 });
  }
};
