/**
 * Runtime site configuration.
 *
 * Merges static SITE config with D1-stored settings.
 * Safe to call on prerendered pages (returns defaults).
 */

import { SITE } from "@/config";
import { getD1, SettingsRepo } from "@/db";

export interface SiteConfig {
  title: string;
  desc: string;
  author: string;
  authorBio: string;
  githubUrl: string;
  twitterUrl: string;
  enableComments: boolean;
  enableRss: boolean;
  enableSearch: boolean;
  enableNewsletter: boolean;
}

const defaults: SiteConfig = {
  title: SITE.title,
  desc: SITE.desc,
  author: SITE.author,
  authorBio: "",
  githubUrl: "",
  twitterUrl: "",
  enableComments: true,
  enableRss: true,
  enableSearch: true,
  enableNewsletter: false,
};

/**
 * Load site config from D1 settings, falling back to static config.
 * Returns defaults if D1 is unavailable.
 */
export async function getSiteConfig(
  locals?: App.Locals
): Promise<SiteConfig> {
  if (!locals) return { ...defaults };

  const db = getD1(locals);
  if (!db) return { ...defaults };

  try {
    const all = await SettingsRepo.getAll(db);
    const saved: Record<string, string> = {};
    for (const s of all) {
      saved[s.key] = s.value;
    }

    return {
      title: saved.siteTitle ?? defaults.title,
      desc: saved.siteDescription ?? defaults.desc,
      author: saved.authorName ?? defaults.author,
      authorBio: saved.authorBio ?? defaults.authorBio,
      githubUrl: saved.githubUrl ?? defaults.githubUrl,
      twitterUrl: saved.twitterUrl ?? defaults.twitterUrl,
      enableComments: saved.enableComments !== "false",
      enableRss: saved.enableRss !== "false",
      enableSearch: saved.enableSearch !== "false",
      enableNewsletter: saved.enableNewsletter === "true",
    };
  } catch {
    return { ...defaults };
  }
}
