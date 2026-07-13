import type { EstadoExtraccion, TipoFactura, Unidad } from "./db-types";

/**
 * Invoice extraction — sellium-brief-desarrollo.md §3.2–3.3.
 *
 * Pure prompt + validation logic (no I/O), so it is unit-testable without a
 * network call or an API key. The route in
 * src/app/api/facturas/extraer/route.ts does the Storage download, the Claude
 * call, and the DB update; it delegates every decision to the functions here.
 */

/** What we ask Claude to return, one object, nothing else. */
export interface ExtraccionRaw {
  tipo_fuente: string | null;
  periodo_inicio: string | null; // YYYY-MM-DD
  periodo_fin: string | null; // YYYY-MM-DD
  consumo: number | null;
  unidad: string | null; // kWh | m3 | litros
}

export const EXTRACTION_PROMPT =
  "Eres un extractor de datos de facturas de suministro (electricidad, gas o " +
  "combustible). Extrae de esta factura: el tipo de fuente, el periodo de " +
  "facturación (fecha de inicio y fin) y el consumo total con su unidad tal " +
  "como aparece (kWh, m³ o litros). " +
  "Reglas estrictas: (1) Si no puedes determinar un campo con seguridad, " +
  "devuelve null en ese campo — NUNCA inventes ni estimes un valor. " +
  "(2) Devuelve el consumo como un número sin separadores de miles ni unidad. " +
  "(3) Las fechas en formato YYYY-MM-DD. " +
  "(4) Responde SOLO con el objeto JSON pedido, sin texto adicional.";

/** Exact JSON shape both providers must return (appended to the prompt). */
export const JSON_SHAPE_INSTRUCTION =
  "Devuelve EXCLUSIVAMENTE un objeto JSON con estas cinco claves exactas: " +
  '{"tipo_fuente": string|null, "periodo_inicio": string|null, "periodo_fin": string|null, "consumo": number|null, "unidad": string|null}. ' +
  'tipo_fuente uno de "electricidad_red","gas_natural","gasoleo_a","gasoleo_c","gasolina","otro" o null. ' +
  "periodo_inicio y periodo_fin en formato YYYY-MM-DD o null. " +
  "consumo: número sin separadores de miles ni unidad, o null. " +
  'unidad una de "kWh","m3","litros" o null.';

/** Strips ```json fences a model may wrap around its JSON output. */
export function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/**
 * JSON schema for output_config.format. Numeric range checks are NOT expressed
 * here (structured outputs don't support minimum/maximum) — they run in
 * validarExtraccion below.
 */
export const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipo_fuente: {
      type: ["string", "null"],
      enum: [
        "electricidad_red",
        "gas_natural",
        "gasoleo_a",
        "gasoleo_c",
        "gasolina",
        "otro",
        null,
      ],
    },
    periodo_inicio: { type: ["string", "null"], format: "date" },
    periodo_fin: { type: ["string", "null"], format: "date" },
    consumo: { type: ["number", "null"] },
    unidad: { type: ["string", "null"], enum: ["kWh", "m3", "litros", null] },
  },
  required: ["tipo_fuente", "periodo_inicio", "periodo_fin", "consumo", "unidad"],
} as const;

const UNIDADES_VALIDAS: Unidad[] = ["kWh", "m3", "litros"];

/**
 * Generous sanity ceilings per unit. A value above these (or ≤ 0) is not
 * trusted and routes the bill to manual review rather than a silent bad number.
 * These are deliberately loose — they catch OCR disasters (a decimal point read
 * as a thousands separator), not borderline-large real consumption.
 */
const TECHOS: Record<Unidad, number> = {
  kWh: 50_000_000, // very large industrial annual electricity/gas
  m3: 5_000_000,
  litros: 2_000_000,
};

const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ResultadoValidacion {
  estado: EstadoExtraccion; // 'ok' | 'revision_manual'
  consumo_extraido: number | null;
  unidad: Unidad | null;
  periodo_inicio: string | null;
  periodo_fin: string | null;
  /** Human-readable reasons the bill needs manual review (empty when ok). */
  motivos: string[];
}

/**
 * Turns Claude's raw extraction into a validated DB-ready result. Any missing,
 * out-of-range, or inconsistent field marks the bill `revision_manual` so the
 * user confirms it before it ever reaches a report (brief §3.3).
 *
 * @param raw   parsed model output
 * @param tipo  the bill type the user chose at upload (cross-check)
 */
export function validarExtraccion(
  raw: ExtraccionRaw,
  tipo: TipoFactura,
): ResultadoValidacion {
  const motivos: string[] = [];

  const unidad =
    raw.unidad && (UNIDADES_VALIDAS as string[]).includes(raw.unidad)
      ? (raw.unidad as Unidad)
      : null;
  if (raw.unidad && !unidad) motivos.push(`Unidad no reconocida: ${raw.unidad}`);
  if (!unidad) motivos.push("Falta la unidad de consumo");

  if (raw.consumo == null) {
    motivos.push("No se pudo extraer el consumo");
  } else if (!Number.isFinite(raw.consumo) || raw.consumo <= 0) {
    motivos.push(`Consumo fuera de rango: ${raw.consumo}`);
  } else if (unidad && raw.consumo > TECHOS[unidad]) {
    motivos.push(`Consumo inverosímil para ${unidad}: ${raw.consumo}`);
  }

  for (const [campo, valor] of [
    ["periodo_inicio", raw.periodo_inicio],
    ["periodo_fin", raw.periodo_fin],
  ] as const) {
    if (!valor) motivos.push(`Falta ${campo}`);
    else if (!FECHA_RE.test(valor)) motivos.push(`Fecha inválida en ${campo}: ${valor}`);
  }

  if (
    raw.periodo_inicio &&
    raw.periodo_fin &&
    FECHA_RE.test(raw.periodo_inicio) &&
    FECHA_RE.test(raw.periodo_fin) &&
    raw.periodo_inicio > raw.periodo_fin
  ) {
    motivos.push("El periodo de inicio es posterior al de fin");
  }

  // Cross-check the model's fuente against the user-declared bill type. A gas
  // bill that reads as electricity (or vice versa) is suspicious.
  const esperada = FUENTE_ESPERADA[tipo];
  if (raw.tipo_fuente && esperada && !esperada.includes(raw.tipo_fuente)) {
    motivos.push(
      `El tipo detectado (${raw.tipo_fuente}) no coincide con el declarado (${tipo})`,
    );
  }

  const consumoOk =
    raw.consumo != null &&
    Number.isFinite(raw.consumo) &&
    raw.consumo > 0 &&
    unidad != null &&
    raw.consumo <= TECHOS[unidad];

  return {
    estado: motivos.length === 0 && consumoOk ? "ok" : "revision_manual",
    consumo_extraido: consumoOk ? raw.consumo : null,
    unidad,
    periodo_inicio: raw.periodo_inicio,
    periodo_fin: raw.periodo_fin,
    motivos,
  };
}

/** Which tipo_fuente values are consistent with each declared bill type. */
const FUENTE_ESPERADA: Record<TipoFactura, string[] | null> = {
  electricidad: ["electricidad_red"],
  gas: ["gas_natural"],
  combustible: ["gasoleo_a", "gasoleo_c", "gasolina"],
  otro: null, // anything goes
};
