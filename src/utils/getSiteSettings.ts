/**
 * Dynamic site settings loader
 *
 * Merges static SITE config with D1-stored overrides.
 * Falls back to static config when D1 is unavailable.
 */

import { SITE } from "@/config";
import { getD1, SettingsRepo } from "@/db";

export interface SiteSettings {
  title: string;
  desc: string;
  author: string;
  authorBio: string;
  githubUrl: string;
  twitterUrl: string;
}

export async function getSiteSettings(
  locals?: App.Locals
): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    title: SITE.title,
    desc: SITE.desc,
    author: SITE.author,
    authorBio: "",
    githubUrl: "",
    twitterUrl: "",
  };

  if (!locals) return defaults;

  const db = getD1(locals);
  if (!db) return defaults;

  try {
    const all = await SettingsRepo.getAll(db);
    const map: Record<string, string> = {};
    for (const s of all) {
      map[s.key] = s.value;
    }

    return {
      title: map.siteTitle ?? defaults.title,
      desc: map.siteDescription ?? defaults.desc,
      author: map.authorName ?? defaults.author,
      authorBio: map.authorBio ?? defaults.authorBio,
      githubUrl: map.githubUrl ?? defaults.githubUrl,
      twitterUrl: map.twitterUrl ?? defaults.twitterUrl,
    };
  } catch {
    return defaults;
  }
}
