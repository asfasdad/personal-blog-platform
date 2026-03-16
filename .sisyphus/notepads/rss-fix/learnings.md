Task: Fix RSS runtime bug by removing node:fs dependent import and localizing link generation.

- Changes made:
  - Removed import of getPath from src/pages/rss.xml.ts
  - Implemented a small local slugifySimple helper to sanitize URL path segments
  - Replaced usage of getPath(post.id, post.filePath) with a local build of the link:
    base /blog /<segments from path> / <slug derived from id>
  - Kept feed structure: title, description, site, pubDate unchanged
  - No changes to content config or getPath.ts

- Verification steps performed:
  - Ran pnpm build successfully; static /rss.xml was generated in the dist output
  - Confirmed the server log shows /rss.xml is present in prerendered routes
  - Local URL structure should render with links like https://blog.158247.xyz/blog/…

- Notes:
  - The plan was strictly to modify a single file in place and avoid touching other utilities
  - If further refinements are needed for non-ASCII paths, the slugifySimple can be extended
