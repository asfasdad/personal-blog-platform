import type { APIRoute } from "astro";

export const prerender = false;

const now = () => new Date().toISOString();

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      latestWorkflow: "ai-draft-pipeline: success",
      latestDeploy: "cloudflare-preview: success",
      draftQueue: 2,
      emergencyPaused: false,
      audit: [
        { timestamp: now(), action: "status-refresh", status: "ok" },
      ],
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
