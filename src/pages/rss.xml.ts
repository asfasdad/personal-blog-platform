import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import getSortedPosts from "@/utils/getSortedPosts";
// Removed getPath import to avoid node-based dependencies in worker bundle.
function slugifySimple(input: string): string {
  if (!input) return "";
  const s = input.trim().toLowerCase();
  if (!s) return "";
  let out = s.replace(/[\s_]+/g, "-");
  out = out.replace(/-+/g, "-");
  out = out.replace(/[^a-z0-9-]/g, "");
  out = out.replace(/^-+|-+$/g, "");
  return out;
}

export const prerender = true;

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  const BLOG_PATH = "src/content/blog";

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(post => {
      // Local link generation to avoid importing node-only helpers
      const filePath = post.filePath ?? "";
      const relative = filePath.startsWith(BLOG_PATH)
        ? filePath.slice(BLOG_PATH.length)
        : filePath;
      const parts = relative
        .split("/")
        .filter((p: string) => p && p !== "")
        .filter((p: string) => !p.startsWith("_"))
        .slice(0, -1)
        .map((p: string) => slugifySimple(p));

      const idParts = (post.id ?? "").split("/");
      const rawSlug = idParts.length > 0 ? idParts[idParts.length - 1] : "";
      const postSlug = slugifySimple(rawSlug);

      const basePath = "/blog";
      const joined = parts.length > 0 ? parts.join("/") : "";
      const link = joined ? basePath + "/" + joined + "/" + postSlug : basePath + "/" + postSlug;

      return {
        title: post.data.title,
        description: post.data.description,
        link,
        pubDate: post.data.pubDatetime,
      };
    }),
  });
}
