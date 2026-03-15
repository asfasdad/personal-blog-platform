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
      env?: Record<string, string | undefined>;
    };
  }
}

export {};
