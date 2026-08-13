const allowedOrigins = new Set([
  "https://jsg0303.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
]);

const encoder = new TextEncoder();
const ADMIN_PASSWORD_HASH = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && allowedOrigins.has(origin) ? origin : "https://jsg0303.vercel.app";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return result === 0;
}

async function sha256(value: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function createToken(secret: string) {
  const payload = base64Url(encoder.encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, nonce: crypto.randomUUID() })));
  return payload + "." + base64Url(await hmac(payload, secret));
}

async function verifyToken(token: string, secret: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, base64Url(await hmac(payload, secret)))) return false;
  try {
    const decoded = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload))) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Server configuration error" }, 500, origin);

  let body: { action?: string; password?: string; token?: string; postId?: string };
  try { body = await request.json(); } catch { return json({ error: "Invalid request" }, 400, origin); }

  if (body.action === "login") {
    if (typeof body.password !== "string" || !safeEqual(await sha256(body.password), ADMIN_PASSWORD_HASH)) {
      return json({ error: "Invalid password" }, 401, origin);
    }
    return json({ token: await createToken(serviceRoleKey) }, 200, origin);
  }

  if (body.action !== "delete" || typeof body.token !== "string" || !(await verifyToken(body.token, serviceRoleKey))) {
    return json({ error: "Unauthorized" }, 401, origin);
  }
  if (typeof body.postId !== "string" || !UUID_PATTERN.test(body.postId)) return json({ error: "Invalid post ID" }, 400, origin);

  const serviceHeaders = { apikey: serviceRoleKey, Authorization: "Bearer " + serviceRoleKey };
  const mediaResponse = await fetch(supabaseUrl + "/rest/v1/community_media?post_id=eq." + encodeURIComponent(body.postId) + "&select=storage_path", { headers: serviceHeaders });
  if (!mediaResponse.ok) return json({ error: "Could not read post media" }, 502, origin);
  const media = await mediaResponse.json() as Array<{ storage_path: string }>;

  for (const item of media) {
    const encodedPath = item.storage_path.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(supabaseUrl + "/storage/v1/object/community-media/" + encodedPath, { method: "DELETE", headers: serviceHeaders });
    if (!response.ok && response.status !== 404) return json({ error: "Could not delete post media" }, 502, origin);
  }

  const deleteResponse = await fetch(supabaseUrl + "/rest/v1/community_posts?id=eq." + encodeURIComponent(body.postId), {
    method: "DELETE",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
  });
  if (!deleteResponse.ok) return json({ error: "Could not delete post" }, 502, origin);
  return json({ ok: true }, 200, origin);
});
