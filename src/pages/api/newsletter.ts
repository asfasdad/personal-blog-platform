import type { APIRoute } from "astro";

const BUTTONDOWN_ENDPOINT = "https://api.buttondown.email/v1/subscribers";

const isValidEmail = (email: string) => /.+@.+\..+/.test(email.trim());

type ButtondownError = {
  detail?: string;
  email?: string[];
};

export const POST: APIRoute = async ({ request }) => {
  let email = "";

  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim() ?? "";
  } catch {
    return new Response(JSON.stringify({ message: "Invalid request payload." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ message: "Please enter a valid email address." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ message: "Subscription service unavailable." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const providerResponse = await fetch(BUTTONDOWN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (providerResponse.ok) {
      return new Response(
        JSON.stringify({ status: "subscribed", message: "Subscribed successfully." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const providerError = (await providerResponse.json().catch(() => null)) as ButtondownError | null;
    const detail = providerError?.detail?.toLowerCase() ?? "";
    const emailError = providerError?.email?.join(" ").toLowerCase() ?? "";

    if (detail.includes("already") || emailError.includes("already")) {
      return new Response(
        JSON.stringify({ status: "already_subscribed", message: "Already subscribed." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (providerResponse.status >= 500) {
      return new Response(JSON.stringify({ message: "Subscription provider unavailable." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Subscription request could not be processed." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ message: "Subscription provider unavailable." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
};
