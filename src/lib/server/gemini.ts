import "server-only";
import { requireEnv } from "./env";
import { JSON_SHAPE_INSTRUCTION, stripCodeFences, type ExtraccionRaw } from "../extraccion";

/**
 * Server-only Google Gemini client for invoice extraction (free tier).
 *
 * The API key never leaves the server. We deliberately use the plain REST
 * endpoint (no SDK) so there's nothing extra to bundle. The prompt and the
 * downstream validation live in src/lib/extraccion.ts and are provider-agnostic;
 * this module only turns a file + prompt into the raw JSON they expect.
 *
 * Model is overridable via GEMINI_MODEL (not a secret) so we can move to a newer
 * Flash without a code change.
 */
// `gemini-flash-latest` is Google's rolling alias for the current Flash model
// (Gemini 3.5 Flash as of 2026), so we don't break when a pinned version is
// retired for new users. Override with GEMINI_MODEL to pin a specific version.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function extraerConGemini(
  mime: string,
  base64: string,
  prompt: string,
): Promise<ExtraccionRaw> {
  const key = requireEnv("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { inline_data: { mime_type: mime, data: base64 } },
          { text: `${prompt}\n\n${JSON_SHAPE_INSTRUCTION}` },
        ],
      },
    ],
    generationConfig: { responseMimeType: "application/json", temperature: 0 },
  });

  // The free tier returns 503 (overloaded) or 429 (rate limit) under load; these
  // spikes are transient, so retry a few times with a short backoff before
  // surfacing the error (the bill then just falls to manual review). Each
  // attempt is time-boxed so one hung request can't burn the whole budget.
  const MAX_ATTEMPTS = 3;
  const PER_ATTEMPT_MS = 18_000;
  const RETRYABLE = new Set([429, 500, 502, 503]);
  let lastDetail = "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PER_ATTEMPT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body,
        signal: controller.signal,
      });
    } catch (e) {
      // Timeout/network error — retry if we can.
      lastDetail = e instanceof Error ? e.message : String(e);
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(600 * 2 ** attempt);
        continue;
      }
      throw new Error(`Gemini no respondió a tiempo: ${lastDetail}`);
    } finally {
      clearTimeout(timer);
    }

    if (res.ok) {
      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini devolvió una respuesta vacía");
      return JSON.parse(stripCodeFences(text)) as ExtraccionRaw;
    }

    lastDetail = (await res.text()).slice(0, 300);
    if (RETRYABLE.has(res.status) && attempt < MAX_ATTEMPTS - 1) {
      await sleep(600 * 2 ** attempt); // 0.6s, 1.2s
      continue;
    }
    throw new Error(`Gemini ${res.status}: ${lastDetail}`);
  }

  throw new Error(`Gemini saturado tras ${MAX_ATTEMPTS} intentos: ${lastDetail}`);
}
