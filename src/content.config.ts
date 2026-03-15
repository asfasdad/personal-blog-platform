import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/content/blog";
export const PROJECTS_PATH = "src/content/projects";

const project = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    publishAt: z.date().optional().nullable(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    website: z.string().url().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      publishAt: z.date().optional().nullable(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

export const collections = { blog, projects: project };
