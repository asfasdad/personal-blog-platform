/// <reference types="astro/client" />

declare global {
  interface Window {
    theme?: {
      themeValue: string;
      setPreference: () => void;
      reflectPreference: () => void;
      getTheme: () => string;
      setTheme: (value: string) => void;
    };
  }

  // Cache for cloudflare:workers env (set by getCfEnv utility)
  // eslint-disable-next-line no-var
  var __cfEnvCache: Record<string, unknown> | undefined;
}

declare namespace App {
  interface Locals {
    // Astro v6 removed locals.runtime.env for @astrojs/cloudflare.
    // Use getCfEnv() from @/utils/getCfEnv instead.
    // Legacy runtime kept as optional for backward compat.
    runtime?: {
      env?: Record<string, unknown>;
    };
  }
}

export {};
