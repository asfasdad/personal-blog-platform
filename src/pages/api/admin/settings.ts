import type { APIRoute } from "astro";
import { getD1, SettingsRepo } from "@/db";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getD1(locals);
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not available" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await request.json();

    // Save each setting key-value pair
    const entries = Object.entries(data as Record<string, unknown>);
    for (const [key, value] of entries) {
      await SettingsRepo.set(db, key, typeof value === "string" ? value : JSON.stringify(value));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Settings saved successfully",
        saved: entries.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save settings";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = getD1(locals);
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not available" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const settings = await SettingsRepo.getAll(db);
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }

    return new Response(
      JSON.stringify({ success: true, settings: result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
