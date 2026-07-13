import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { requireEnv } from "./env";
import { JSON_SHAPE_INSTRUCTION, stripCodeFences, type ExtraccionRaw } from "../extraccion";

/**
 * Server-only Claude client for invoice extraction. The API key never leaves the
 * server (this module is `server-only`, so importing it into a client component
 * fails the build).
 *
 * Model: Haiku 4.5 — the low-cost choice for high-volume vision work
 * ($1/$5 per MTok). An extraction is a fraction of a cent, so a small prepaid
 * balance covers thousands of invoices. To favour accuracy over cost, switch
 * this constant to "claude-opus-4-8".
 */
export const EXTRACTION_MODEL = "claude-haiku-4-5";

let cached: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!cached) {
    // maxRetries handles 429/500/529 (overloaded) with exponential backoff.
    cached = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY"), maxRetries: 3 });
  }
  return cached;
}

/** Content block for the uploaded file, by MIME type. */
function fileBlock(mime: string, base64: string) {
  if (mime === "application/pdf") {
    return {
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 },
    };
  }
  const media = (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime)
    ? mime
    : "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  return {
    type: "image" as const,
    source: { type: "base64" as const, media_type: media, data: base64 },
  };
}

export async function extraerConClaude(
  mime: string,
  base64: string,
  prompt: string,
): Promise<ExtraccionRaw> {
  const message = await getAnthropic().messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          fileBlock(mime, base64),
          { type: "text", text: `${prompt}\n\n${JSON_SHAPE_INSTRUCTION}` },
        ],
      },
    ],
  });

  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Claude no devolvió texto");
  }
  return JSON.parse(stripCodeFences(block.text)) as ExtraccionRaw;
}
