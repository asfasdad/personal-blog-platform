import type { APIRoute } from "astro";
import { deletePost, getPost, updatePost } from "@/lib/admin-store";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Post id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const post = await getPost(locals, id);
  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ post }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT: APIRoute = async ({ request, params, locals }) => {
  const { id } = params;
  if (!id) {
    return new Response("Post id is required", { status: 400 });
  }
  
  try {
    const data = await request.json();
    const { title, description, tags, content, draft } = data;

    // Validate required fields
    if (!title || !content) {
      return new Response("Title and content are required", { status: 400 });
    }

    const normalizedTags = Array.isArray(tags)
      ? tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
      : [];

    const updated = await updatePost(locals, id, {
      title: String(title),
      description: String(description ?? ""),
      tags: normalizedTags,
      content: String(content),
      draft: Boolean(draft),
    });

    if (!updated) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        slug: updated.slug,
        id: updated.id,
        message: "Post updated successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Post id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  try {
    const removed = await deletePost(locals, id);
    if (!removed) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Post deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete post" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const POST: APIRoute = async (context) => {
  return DELETE(context);
};
