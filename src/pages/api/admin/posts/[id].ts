import type { APIRoute } from "astro";
import { getD1, PostsRepo } from "@/db";

export const PUT: APIRoute = async ({ request, params, locals }) => {
  const { id } = params;

  try {
    const db = getD1(locals);
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not available" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Post ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await request.json();
    const { title, description, tags, content, draft } = data;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existing = await PostsRepo.findBySlug(db, id);
    if (!existing) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const post = await PostsRepo.update(db, id, {
      title,
      description: description || "",
      content,
      tags: tags || [],
      draft: draft ?? false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        slug: id,
        post,
        message: "Post updated successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { id } = params;

  try {
    const db = getD1(locals);
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not available" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Post ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await PostsRepo.delete(db, id);
    if (!deleted) {
      return new Response(
        JSON.stringify({ error: "Post not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
