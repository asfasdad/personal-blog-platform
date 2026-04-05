/**
 * Safe accessor for Cloudflare Workers environment bindings.
 *
 * Astro v6 removed `locals.runtime.env`. The new pattern is
 * `import { env } from "cloudflare:workers"`.
 *
 * This module caches the env at import time and exposes helpers
 * that work both in Cloudflare Workers and local/test environments.
 */

const DEFAULT_ADMIN_KEY = "local-admin-key";

let cfEnv: Record<string, unknown> | null = null;

// Eagerly resolve cloudflare:workers env (no-op outside CF runtime)
try {
  // @ts-expect-error cloudflare:workers is a CF-specific virtual module
  import("cloudflare:workers")
    .then((mod: { env?: Record<string, unknown> }) => {
      if (mod?.env) cfEnv = mod.env as Record<string, unknown>;
    })
    .catch(() => {
      /* not in CF runtime */
    });
} catch {
  /* not in CF runtime */
}

export function getCfEnv(): Record<string, unknown> | null {
  return cfEnv;
}

export function getAdminKey(): string {
  const env = getCfEnv();
  return (
    (env?.ADMIN_ACCESS_KEY as string | undefined) ??
    (typeof process !== "undefined"
      ? process.env?.ADMIN_ACCESS_KEY
      : undefined) ??
    DEFAULT_ADMIN_KEY
  );
}
