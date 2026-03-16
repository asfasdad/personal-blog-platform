#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import slugify from "slugify";

const BLOG_DIR = path.resolve(process.cwd(), "src/content/blog");

const parseArgs = argv => {
  const named = {};
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      named[key] = "true";
      continue;
    }

    named[key] = value;
    i += 1;
  }

  return { named, positional };
};

const toIso = date => {
  const iso = date.toISOString();
  return iso.slice(0, 19) + "Z";
};

const fallbackTitle = date => `New Post ${date.toISOString().slice(0, 10)}`;

const createSlug = value =>
  slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

const usage = () => {
  const msg = [
    "Usage:",
    "  pnpm new:post --title \"My First Post\"",
    "  pnpm new:post \"My First Post\"",
    "  pnpm new:post --title \"My First Post\" --slug \"my-first-post\"",
  ].join("\n");

  console.log(msg);
};

const main = () => {
  const { named, positional } = parseArgs(process.argv.slice(2));

  if (named.help === "true") {
    usage();
    process.exit(0);
  }

  const now = new Date();
  const title = named.title ?? positional.join(" ").trim() ?? "";
  const finalTitle = title || fallbackTitle(now);

  const requestedSlug = (named.slug ?? "").trim();
  const generatedSlug = createSlug(finalTitle);
  const finalSlug = requestedSlug || generatedSlug;

  if (!finalSlug) {
    console.error("Failed to generate slug. Please pass --slug explicitly.");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  const fileName = `${finalSlug}.md`;
  const filePath = path.join(BLOG_DIR, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`Post already exists: ${filePath}`);
    process.exit(1);
  }

  const template = [
    "---",
    "author: Author Name",
    `pubDatetime: ${toIso(now)}`,
    `title: ${JSON.stringify(finalTitle)}`,
    "featured: false",
    "draft: true",
    "tags:",
    "  - others",
    'description: "Write a short summary for this post."',
    "---",
    "",
    "## Intro",
    "",
    "Write your content here.",
    "",
  ].join("\n");

  fs.writeFileSync(filePath, template, "utf8");

  console.log(`Created post: ${filePath}`);
  console.log("Next:");
  console.log("1) Edit the file content and set draft: false when ready");
  console.log("2) Run: pnpm dev");
  console.log("3) Push to publish: git add . && git commit -m \"add: post\" && git push origin main");
};

main();
