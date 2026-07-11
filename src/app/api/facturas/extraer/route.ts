import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServiceClient } from "@/lib/server/supabase";
import { requireEnv } from "@/lib/server/env";
import type { FacturaConsumo } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/facturas/extraer  — sellium-brief-desarrollo.md §3.2–3.3
 *
 * Given an uploaded bill id, download it from Storage, ask Claude (vision) to
 * return ONLY structured consumption JSON, and persist the result. Any field
 * Claude cannot determine with confidence comes back null → the row is flagged
 * `revision_manual` and the user confirms it before it ever reaches a report.
 *
 * The ANTHROPIC_API_KEY never leaves the server (this route is `runtime:nodejs`
 * and the key is read via requireEnv, never NEXT_PUBLIC).
 */

interface ExtraerBody {
  facturaId: string;
}

interface ExtraccionResult {
  tipo_fuente: string | null;
  periodo_inicio: string | null;
  periodo_fin: string | null;
  consumo: number | null;
  unidad: string | null;
}

const EXTRACTION_PROMPT =
  "Extrae de esta factura de suministro el periodo de facturación y el consumo " +
  "total en la unidad que aparezca (kWh, m³ o litros). Si no puedes determinar " +
  "algún campo con seguridad, indica null en ese campo en vez de inventar un " +
  "valor. Responde SOLO con un objeto JSON con las claves: tipo_fuente, " +
  "periodo_inicio (YYYY-MM-DD), periodo_fin (YYYY-MM-DD), consumo (número), unidad.";

export async function POST(req: Request) {
  let body: ExtraerBody;
  try {
    body = (await req.json()) as ExtraerBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.facturaId) {
    return NextResponse.json({ error: "facturaId is required" }, { status: 400 });
  }

  const db = getServiceClient();

  // 1. Load the bill row.
  const { data: factura, error: loadErr } = await db
    .from("facturas_consumo")
    .select("*")
    .eq("id", body.facturaId)
    .single<FacturaConsumo>();

  if (loadErr || !factura) {
    return NextResponse.json({ error: "Factura not found" }, { status: 404 });
  }

  // 2. Ask Claude to read the file. (Downloading the bytes from Storage and
  //    attaching them as an image/document block is the remaining wiring.)
  const anthropic = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
  void anthropic;
  void EXTRACTION_PROMPT;

  // TODO(extraction): fetch factura.archivo_url from Storage, send it + prompt to
  // anthropic.messages.create({ model: "claude-opus-4-8", ... }), parse the JSON.
  return NextResponse.json(
    {
      error: "Not implemented",
      detail:
        "Extraction wiring pending: download archivo_url from Storage, call " +
        "Claude vision, parse JSON, update facturas_consumo.",
      facturaId: factura.id,
    },
    { status: 501 },
  );
}

// Exported for the eventual implementation + unit tests.
export type { ExtraerBody, ExtraccionResult };
