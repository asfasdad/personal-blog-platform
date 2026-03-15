import type { MiddlewareHandler } from "astro";

const getConfiguredAdminKey = (env: Record<string, string | undefined>) =>
  env.ADMIN_ACCESS_KEY ?? "local-admin-key";

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

  const configuredKey = getConfiguredAdminKey(getRuntimeEnv(context.locals));
  const cookieKey = context.cookies.get("admin_access")?.value;
  const headerKey = context.request.headers.get("x-admin-access-key");
  const isAuthorized = cookieKey === configuredKey || headerKey === configuredKey;

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
