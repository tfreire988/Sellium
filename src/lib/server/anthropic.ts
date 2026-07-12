import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { requireEnv } from "./env";

/**
 * Server-only Anthropic client. The API key never leaves the server
 * (sellium-brief-desarrollo.md §4) — this module is marked `server-only`, so
 * importing it into a client component fails the build.
 */

/**
 * Model used for invoice extraction. Per the Claude API guidance the default is
 * Opus 4.8. Invoice extraction is a high-volume vision workload, so this is the
 * single knob to turn if you want to trade some accuracy for lower cost —
 * `claude-haiku-4-5` ($1/$5 per MTok vs $5/$25) is the usual budget choice.
 * Changing this string is the only edit required.
 */
export const EXTRACTION_MODEL = "claude-opus-4-8";

let cached: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (cached) return cached;
  cached = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
  return cached;
}
