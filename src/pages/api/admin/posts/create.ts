import type { APIRoute } from "astro";
import { createPost } from "@/lib/admin-store";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { title, slug, description, tags, content, action } = data;

    // Validate required fields
    if (!title || !content) {
      return new Response("Title and content are required", { status: 400 });
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    const normalizedTags = Array.isArray(tags)
      ? tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
      : [];

    const created = await createPost(locals, {
      slug: finalSlug,
      title: String(title),
      description: String(description ?? ""),
      tags: normalizedTags,
      content: String(content),
      draft: action === "draft",
    });

    return new Response(
      JSON.stringify({
        success: true,
        slug: created.slug,
        id: created.id,
        message: "Post created successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
