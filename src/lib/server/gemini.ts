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
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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

export async function extraerConGemini(
  mime: string,
  base64: string,
  prompt: string,
): Promise<ExtraccionRaw> {
  const key = requireEnv("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mime, data: base64 } },
            { text: `${prompt}\n\n${SHAPE_INSTRUCTION}` },
          ],
        },
      ],
      generationConfig: { responseMimeType: "application/json", temperature: 0 },
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new Error(`Gemini ${res.status}: ${detail}`);
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini devolvió una respuesta vacía");

  return JSON.parse(stripFences(text)) as ExtraccionRaw;
}
