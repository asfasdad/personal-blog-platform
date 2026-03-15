import type { APIRoute } from "astro";

export const prerender = false;

const getAdminKey = () => process.env.ADMIN_ACCESS_KEY ?? "local-admin-key";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const configuredKey = getAdminKey();

  let key = "";
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as { key?: string };
    key = String(body.key ?? "");
  } else if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    key = String(formData.get("key") ?? "");
  }

  if (key !== configuredKey) {
    return redirect("/admin/login?error=invalid");
  }

  cookies.set("admin_access", configuredKey, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    maxAge: 60 * 60 * 8,
  });

  return redirect("/admin");
};
