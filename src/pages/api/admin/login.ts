import type { APIRoute } from "astro";
import { timingSafeEqual, createSessionCookie } from "@/utils/auth";
import { getAdminKey } from "@/utils/getCfEnv";

export const prerender = false;

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

  if (!timingSafeEqual(key, configuredKey)) {
    return redirect("/admin/login?error=invalid");
  }

  // Store a hashed session token instead of the raw key
  const sessionToken = await createSessionCookie(configuredKey);

  cookies.set("admin_access", sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    maxAge: 60 * 60 * 8,
  });

  return redirect("/admin");
};
