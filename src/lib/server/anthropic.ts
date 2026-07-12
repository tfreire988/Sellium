import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { requireEnv } from "./env";

/**
 * Server-only Anthropic client. The API key never leaves the server
 * (sellium-brief-desarrollo.md §4) — this module is marked `server-only`, so
 * importing it into a client component fails the build.
 */

/**
 * Model used for invoice extraction. The Claude API default is Opus 4.8;
 * per the project's explicit budget constraint (prepaid, auto-recharge off) this
 * is set to Haiku 4.5 — the usual low-cost choice for high-volume vision work
 * ($1/$5 per MTok vs Opus's $5/$25). To favour accuracy over cost, switch this
 * single constant back to "claude-opus-4-8"; nothing else changes.
 */
export const EXTRACTION_MODEL = "claude-haiku-4-5";

let cached: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (cached) return cached;
  cached = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
  return cached;
}
