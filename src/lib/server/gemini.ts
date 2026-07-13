import "server-only";
import { requireEnv } from "./env";
import type { ExtraccionRaw } from "../extraccion";

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

/** Exact JSON shape validarExtraccion expects — spelled out for the model. */
const SHAPE_INSTRUCTION =
  'Devuelve EXCLUSIVAMENTE un objeto JSON con estas cinco claves exactas: ' +
  '{"tipo_fuente": string|null, "periodo_inicio": string|null, "periodo_fin": string|null, "consumo": number|null, "unidad": string|null}. ' +
  'tipo_fuente ∈ {"electricidad_red","gas_natural","gasoleo_a","gasoleo_c","gasolina","otro"} o null. ' +
  'periodo_inicio y periodo_fin en formato YYYY-MM-DD o null. ' +
  'consumo: número sin separadores de miles ni unidad, o null. ' +
  'unidad ∈ {"kWh","m3","litros"} o null.';

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

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
          { text: `${prompt}\n\n${SHAPE_INSTRUCTION}` },
        ],
      },
    ],
    generationConfig: { responseMimeType: "application/json", temperature: 0 },
  });

  // The free tier returns 503 (overloaded) or 429 (rate limit) under load; these
  // spikes are transient, so retry a few times with a short backoff before
  // surfacing the error (the bill then just falls to manual review).
  const MAX_ATTEMPTS = 4;
  const RETRYABLE = new Set([429, 500, 502, 503]);
  let lastDetail = "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body,
    });

    if (res.ok) {
      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini devolvió una respuesta vacía");
      return JSON.parse(stripFences(text)) as ExtraccionRaw;
    }

    lastDetail = (await res.text()).slice(0, 300);
    if (RETRYABLE.has(res.status) && attempt < MAX_ATTEMPTS - 1) {
      await sleep(600 * 2 ** attempt); // 0.6s, 1.2s, 2.4s
      continue;
    }
    throw new Error(`Gemini ${res.status}: ${lastDetail}`);
  }

  throw new Error(`Gemini saturado tras ${MAX_ATTEMPTS} intentos: ${lastDetail}`);
}
