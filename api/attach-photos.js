// POST /api/attach-photos: attaches quote-form photos (already uploaded to our
// Vercel Blob store) to the GHL contact's File Upload field {{contact.add_photos}}.
// Configure in Vercel → Settings → Environment Variables:
//   GHL_PIT_TOKEN   Private Integration Token (mark as Sensitive)
//   GHL_LOCATION_ID Sub-account (location) ID
import { createAttachHandler } from "./_ghl-photos-core.js";

export const maxDuration = 30;
export const POST = createAttachHandler({ fetch, env: process.env });
