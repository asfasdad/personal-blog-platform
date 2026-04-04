import type { APIRoute } from "astro";
import { getR2, getD1, MediaRepo } from "@/db";

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const { id, url } = (await request.json()) as { id?: number; url?: string };

    const r2 = getR2(locals);
    const db = getD1(locals);

    // Delete from R2 if we have the URL
    if (r2 && url) {
      // Extract R2 key from URL: /api/admin/media/file/uploads/xxx -> uploads/xxx
      const prefix = "/api/admin/media/file/";
      const key = url.startsWith(prefix) ? url.slice(prefix.length) : null;
      if (key) {
        try {
          await r2.delete(key);
        } catch {
          // R2 delete failed, continue with DB cleanup
        }
      }
    }

    // Delete metadata from D1
    if (db && id) {
      await MediaRepo.delete(db, id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
