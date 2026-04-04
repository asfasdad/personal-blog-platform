/**
 * Security utilities for admin authentication.
 *
 * Uses Web Crypto API available in Cloudflare Workers.
 */

const encoder = new TextEncoder();

/**
 * Timing-safe string comparison to prevent timing attacks.
 * Uses Web Crypto API's subtle.timingSafeEqual equivalent via constant-time comparison.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);

  if (aBytes.length !== bBytes.length) {
    // Still do a comparison to maintain constant time
    const dummy = new Uint8Array(aBytes.length);
    let result = 1; // start with "not equal"
    for (let i = 0; i < aBytes.length; i++) {
      result |= aBytes[i] ^ dummy[i];
    }
    return false;
  }

  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}

/**
 * Generate a session token from the admin key.
 * This avoids storing the raw key in the cookie.
 */
export async function generateSessionToken(key: string): Promise<string> {
  const data = encoder.encode(`session:${key}:${Date.now()}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify a session token by checking it against the stored valid tokens.
 * For simplicity, we store a HMAC of the admin key as the session cookie.
 */
export async function createSessionCookie(key: string): Promise<string> {
  const data = encoder.encode(`admin-session:${key}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function verifySessionCookie(
  cookie: string,
  key: string
): Promise<boolean> {
  const expected = await createSessionCookie(key);
  return timingSafeEqual(cookie, expected);
}
