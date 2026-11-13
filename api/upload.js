// POST /api/upload: stores one quote-form photo in Vercel Blob and returns its
// public URL. The browser resizes photos first, then puts the returned links
// into the form's hidden `add_photos` field, which GoHighLevel's tracking script
// sends to {{contact.add_photos}}. Needs a Vercel Blob store connected to the
// project (that sets BLOB_READ_WRITE_TOKEN).
import { put } from "@vercel/blob";
import { createUploadHandler } from "./_upload-core.js";

export const POST = createUploadHandler(put);
