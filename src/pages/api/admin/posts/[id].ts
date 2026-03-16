import type { APIRoute } from "astro";

export const PUT: APIRoute = async ({ request, params }) => {
  const { id } = params;
  
  try {
    const data = await request.json();
    const { title, description, tags, content, draft } = data;

    // Validate required fields
    if (!title || !content) {
      return new Response("Title and content are required", { status: 400 });
    }

    // Create post data
    const postData = {
      title,
      description: description || "",
      tags: tags || [],
      draft,
    };

    // In a real implementation, you would:
    // 1. Update in database (Cloudflare D1)
    // 2. Or use GitHub API to update the file
    // 3. Or update in KV and trigger a rebuild

    // For now, return success (implement actual storage later)
    console.log("Updating post:", {
      slug: id,
      ...postData,
      contentLength: content.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        slug: id,
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

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    // In a real implementation, you would:
    // 1. Delete from database (Cloudflare D1)
    // 2. Or use GitHub API to delete the file

    console.log("Deleting post:", id);

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
