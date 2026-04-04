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
}

declare namespace App {
  interface Locals {
    runtime?: {
      env?: {
        DB?: D1Database;
        MEDIA?: R2Bucket;
        ADMIN_ACCESS_KEY?: string;
        [key: string]: unknown;
      };
    };
  }
}

export {};
