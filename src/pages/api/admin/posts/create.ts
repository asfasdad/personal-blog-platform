import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
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

    // Create post data
    const postData = {
      title,
      description: description || "",
      pubDatetime: new Date().toISOString(),
      draft: action === "draft",
      tags: tags || [],
    };

    // In a real implementation, you would:
    // 1. Save to database (Cloudflare D1)
    // 2. Or use GitHub API to commit the file
    // 3. Or store in KV and trigger a rebuild

    // For now, return success (implement actual storage later)
    console.log("Creating post:", {
      slug: finalSlug,
      ...postData,
      contentLength: content.length,
    });

    return new Response(
      JSON.stringify({
        success: true,
        slug: finalSlug,
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
