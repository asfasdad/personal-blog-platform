import type { APIRoute } from "astro";
import { getD1, PostsRepo } from "@/db";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = getD1(locals);
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not available" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await request.json();
    const { title, slug, description, tags, content, action } = data;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);

    // Check for slug conflict
    const existing = await PostsRepo.findBySlug(db, finalSlug);
    if (existing) {
      return new Response(
        JSON.stringify({ error: "A post with this slug already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const post = await PostsRepo.create(db, {
      slug: finalSlug,
      title,
      description: description || "",
      content,
      tags: tags || [],
      draft: action === "draft",
      pubDatetime: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        slug: finalSlug,
        post,
        message: "Post created successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
