import type { MiddlewareHandler } from "astro";
import { isAdminKeyValid } from "@/lib/admin-auth";

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

  const cookieKey = context.cookies.get("admin_access")?.value;
  const headerKey = context.request.headers.get("x-admin-access-key");
  const isAuthorized = isAdminKeyValid(cookieKey ?? "", context.locals) || isAdminKeyValid(headerKey ?? "", context.locals);

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
