import type { APIRoute } from "astro";
import { getD1, MediaRepo } from "@/db";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getD1(locals);
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not available", items: [] }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const items = await MediaRepo.findAll(db, { limit: 100 });

    return new Response(
      JSON.stringify({ success: true, items }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list media";
    return new Response(
      JSON.stringify({ error: message, items: [] }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
