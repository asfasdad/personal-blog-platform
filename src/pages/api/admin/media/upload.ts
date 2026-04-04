import type { APIRoute } from "astro";
import { getR2, getD1, MediaRepo } from "@/db";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const r2 = getR2(locals);
    const db = getD1(locals);

    if (!r2) {
      return new Response(
        JSON.stringify({ error: "R2 storage not available" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "bin";
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/[^\w.-]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 100);
    const key = `uploads/${timestamp}-${safeName}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await r2.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Build public URL (assumes custom domain or public bucket access)
    // For Cloudflare Pages, R2 objects can be served via worker routes
    const url = `/api/admin/media/file/${key}`;

    // Save metadata to D1 if available
    if (db) {
      try {
        await MediaRepo.create(db, {
          filename: file.name,
          url,
          content_type: file.type,
          size: file.size,
        });
      } catch {
        // D1 metadata save failed, but file is uploaded
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        url,
        filename: file.name,
        size: file.size,
        contentType: file.type,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
