import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import { extraerConGemini } from "@/lib/server/gemini";
import { extraerConClaude } from "@/lib/server/anthropic";
import { BUCKET_FACTURAS } from "@/lib/server/storage";
import { EXTRACTION_PROMPT, validarExtraccion, type ExtraccionRaw } from "@/lib/extraccion";
import type { FacturaConsumo } from "@/lib/db-types";

export const runtime = "nodejs";
// Extraction can retry a busy free-tier model a few times; give it headroom.
export const maxDuration = 60;

/**
 * POST /api/facturas/extraer  — sellium-brief-desarrollo.md §3.2–3.3
 *
 * Download the uploaded bill from Storage, ask the vision model to return ONLY
 * structured consumption JSON, validate it, and persist the result. Fields the
 * model can't determine come back null → the bill is flagged `revision_manual`
 * and the user confirms it before it ever reaches a report.
 *
 * Extraction runs on Google Gemini (free tier). The API key never leaves the
 * server (runtime: nodejs; read via requireEnv, never NEXT_PUBLIC).
 */

interface ExtraerBody {
  facturaId: string;
}

/**
 * Per-user cap on automatic reads in a rolling 24 h. The prepaid balance is the
 * ultimate hard cap on spend; this stops a single signed-in account from
 * draining it by uploading in a loop. At Haiku prices this ceiling is a few
 * cents/day per user — generous for a real pyme (a handful of bills), tight for
 * an abuser.
 */
const MAX_LECTURAS_DIA = 100;

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

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

  // 1. Load the bill row and confirm ownership.
  const { data: factura, error: loadErr } = await db
    .from("facturas_consumo")
    .select("*")
    .eq("id", body.facturaId)
    .single<FacturaConsumo>();

  if (loadErr || !factura) {
    return NextResponse.json({ error: "Factura not found" }, { status: 404 });
  }
  if (factura.profile_id !== user.id) {
    return NextResponse.json({ error: "Factura ajena" }, { status: 403 });
  }

  // Idempotent: an already-confirmed bill doesn't need re-reading (no model cost).
  if (factura.estado_extraccion === "ok") {
    return NextResponse.json({ factura, motivos: [] });
  }

  // Per-user daily rate limit on automatic reads (defence in depth behind the
  // prepaid spend cap).
  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await db
    .from("facturas_consumo")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", user.id)
    .gte("created_at", desde);
  if ((count ?? 0) > MAX_LECTURAS_DIA) {
    return NextResponse.json(
      {
        error: `Has alcanzado el límite de ${MAX_LECTURAS_DIA} lecturas automáticas al día. Introduce el consumo a mano o inténtalo mañana.`,
      },
      { status: 429 },
    );
  }

  // 2. Download the file bytes from Storage.
  const { data: blob, error: dlErr } = await db
    .storage.from(BUCKET_FACTURAS)
    .download(factura.archivo_url);
  if (dlErr || !blob) {
    return NextResponse.json(
      { error: `No se pudo descargar el archivo: ${dlErr?.message}` },
      { status: 502 },
    );
  }
  const mime = blob.type || "image/jpeg";
  const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");

  // 3. Ask the vision model for structured JSON. Provider is chosen by which key
  //    is configured: Claude if ANTHROPIC_API_KEY is set, otherwise Gemini
  //    (free). Switching providers is just a Vercel env-var change.
  let raw: ExtraccionRaw;
  try {
    raw = process.env.ANTHROPIC_API_KEY
      ? await extraerConClaude(mime, base64, EXTRACTION_PROMPT)
      : await extraerConGemini(mime, base64, EXTRACTION_PROMPT);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "error desconocido";
    return NextResponse.json({ error: `Fallo en la extracción: ${detail}` }, { status: 502 });
  }

  // 4. Validate and persist.
  const resultado = validarExtraccion(raw, factura.tipo);
  const { data: updated, error: updErr } = await db
    .from("facturas_consumo")
    .update({
      consumo_extraido: resultado.consumo_extraido,
      unidad: resultado.unidad,
      periodo_inicio: resultado.periodo_inicio,
      periodo_fin: resultado.periodo_fin,
      estado_extraccion: resultado.estado,
    })
    .eq("id", factura.id)
    .select("*")
    .single<FacturaConsumo>();

  if (updErr || !updated) {
    return NextResponse.json(
      { error: `No se pudo guardar la extracción: ${updErr?.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ factura: updated, motivos: resultado.motivos });
}

export type { ExtraerBody };
