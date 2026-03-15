import type { APIRoute } from "astro";

export const prerender = false;

const ACTION_TO_WORKFLOW_ENV: Record<string, string> = {
  publish: "GITHUB_WORKFLOW_PUBLISH",
  rollback: "GITHUB_WORKFLOW_ROLLBACK",
  pause: "GITHUB_WORKFLOW_PAUSE",
  resume: "GITHUB_WORKFLOW_RESUME",
};

const now = () => new Date().toISOString();

const getRuntimeEnv = (locals: unknown): Record<string, string | undefined> => {
  if (!locals || typeof locals !== "object") {
    return {};
  }

  const runtime = Reflect.get(locals, "runtime");
  if (!runtime || typeof runtime !== "object") {
    return {};
  }

  const env = Reflect.get(runtime, "env");
  if (!env || typeof env !== "object") {
    return {};
  }

  return env as Record<string, string | undefined>;
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getRuntimeEnv(locals);
  const body = (await request.json().catch(() => null)) as { action?: string } | null;
  const action = body?.action ?? "";

  if (!ACTION_TO_WORKFLOW_ENV[action]) {
    return new Response(JSON.stringify({ message: "Unsupported action." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = env.GITHUB_AUTOMATION_TOKEN;
  const owner = env.GITHUB_REPO_OWNER;
  const repo = env.GITHUB_REPO_NAME;
  const workflow = env[ACTION_TO_WORKFLOW_ENV[action]];

  if (token && owner && repo && workflow) {
    const dispatchResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: "main", inputs: { action, requestedAt: now() } }),
      }
    );

    if (!dispatchResponse.ok) {
      return new Response(JSON.stringify({ message: "Workflow dispatch failed." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        result: "workflow-dispatched",
        action,
        timestamp: now(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      result: "mock-dispatched",
      action,
      timestamp: now(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
