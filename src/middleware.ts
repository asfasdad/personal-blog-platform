import type { MiddlewareHandler } from "astro";
import { verifySessionCookie, timingSafeEqual } from "@/utils/auth";

const DEFAULT_KEY = "local-admin-key";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const pathname = context.url.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAdminLoginRoute = pathname === "/admin/login";
  const isAdminLoginApiRoute = pathname === "/api/admin/login";

  if (!isAdminRoute && !isAdminApiRoute) {
    return next();
  }

  if (isAdminLoginRoute || isAdminLoginApiRoute) {
    return next();
  }

  // Get the configured admin key
  const runtimeEnv = (context.locals as App.Locals).runtime?.env;
  const configuredKey =
    (runtimeEnv?.ADMIN_ACCESS_KEY as string | undefined) ??
    process.env.ADMIN_ACCESS_KEY ??
    DEFAULT_KEY;

  const cookieValue = context.cookies.get("admin_access")?.value;
  const headerKey = context.request.headers.get("x-admin-access-key");

  let isAuthorized = false;

  // Check session cookie (hashed token)
  if (cookieValue) {
    isAuthorized = await verifySessionCookie(cookieValue, configuredKey);
  }

  // Fallback: check header key (for API clients)
  if (!isAuthorized && headerKey) {
    isAuthorized = timingSafeEqual(headerKey, configuredKey);
  }

  if (isAuthorized) {
    return next();
  }

  if (isAdminApiRoute) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return context.redirect("/admin/login");
};
