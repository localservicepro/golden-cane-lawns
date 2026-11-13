// Request handling for /api/upload, kept separate from the Vercel Blob client
// so it can be tested with a stand-in `put`.

export const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions accept bodies up to 4.5 MB
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic", "image/heif": "heif" };

// Only the live site, Vercel preview deployments and local development may upload.
const ORIGIN_OK = /^(https:\/\/(www\.)?goldencanelawns\.com\.au|https:\/\/[a-z0-9-]+\.vercel\.app|http:\/\/localhost(:\d+)?)$/;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export function createUploadHandler(put) {
  return async function POST(request) {
    const origin = request.headers.get("origin") || "";
    if (!ORIGIN_OK.test(origin)) return json(403, { error: "Uploads are only accepted from the website." });

    const type = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.includes(type)) return json(415, { error: "Please upload a JPG, PNG, WebP or HEIC photo." });

    const declared = Number(request.headers.get("content-length") || 0);
    if (declared > MAX_BYTES) return json(413, { error: "Photo is too large (max 4 MB)." });
    const body = await request.arrayBuffer();
    if (!body.byteLength) return json(400, { error: "Empty upload." });
    if (body.byteLength > MAX_BYTES) return json(413, { error: "Photo is too large (max 4 MB)." });

    const raw = new URL(request.url).searchParams.get("name") || "photo";
    const base = raw.replace(/\.[^.]*$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "photo";
    const day = new Date().toISOString().slice(0, 10);
    const blob = await put(`quote-photos/${day}/${base}.${EXT[type]}`, body, {
      access: "public",
      contentType: type,
      addRandomSuffix: true,
    });
    return json(200, { url: blob.url });
  };
}
