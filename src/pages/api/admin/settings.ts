import type { APIRoute } from "astro";
import { readSettings, saveSettings } from "@/lib/admin-store";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const settings = await readSettings(locals);
  return new Response(JSON.stringify({ settings }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const settings = await saveSettings(locals, data as Record<string, unknown>);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Settings saved successfully",
        settings,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving settings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save settings" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
