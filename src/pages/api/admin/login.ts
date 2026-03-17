import type { APIRoute } from "astro";
import { isAdminKeyValid, resolveAdminKey } from "@/lib/admin-auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, locals }) => {
  const configuredKey = resolveAdminKey(locals);

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

  if (!isAdminKeyValid(key, locals)) {
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
