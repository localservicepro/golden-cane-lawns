// POST /api/quote: sends a quote-form lead to GoHighLevel (contact + custom
// fields + photos), then adds the "website-quote" tag that triggers the workflow.
// Configure in Vercel → Settings → Environment Variables:
//   GHL_PIT_TOKEN   Private Integration Token (mark as Sensitive)
//   GHL_LOCATION_ID Sub-account (location) ID
import { createQuoteHandler } from "./_ghl-quote-core.js";

export const maxDuration = 30;
export const POST = createQuoteHandler({ fetch, env: process.env });
