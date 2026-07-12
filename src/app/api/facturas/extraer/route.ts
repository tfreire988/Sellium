import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import { getAnthropic, EXTRACTION_MODEL } from "@/lib/server/anthropic";
import { BUCKET_FACTURAS } from "@/lib/server/storage";
import {
  EXTRACTION_PROMPT,
  EXTRACTION_SCHEMA,
  validarExtraccion,
  type ExtraccionRaw,
} from "@/lib/extraccion";
import type { FacturaConsumo } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/facturas/extraer  — sellium-brief-desarrollo.md §3.2–3.3
 *
 * Download the uploaded bill from Storage, ask Claude (vision) to return ONLY
 * structured consumption JSON, validate it, and persist the result. Fields
 * Claude can't determine come back null → the bill is flagged `revision_manual`
 * and the user confirms it before it ever reaches a report.
 *
 * The ANTHROPIC_API_KEY never leaves the server (runtime: nodejs; read via
 * getAnthropic()/requireEnv, never NEXT_PUBLIC).
 */

interface ExtraerBody {
  facturaId: string;
}

/** Pick the Claude content block for the file based on its MIME type. */
function fileBlock(mime: string, base64: string) {
  if (mime === "application/pdf") {
    return {
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 },
    };
  }
  // Images: jpeg/png/webp/gif
  const media = (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mime)
    ? mime
    : "image/jpeg") as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  return {
    type: "image" as const,
    source: { type: "base64" as const, media_type: media, data: base64 },
  };
}

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

  // 3. Ask Claude for structured JSON.
  const anthropic = getAnthropic();
  let raw: ExtraccionRaw;
  try {
    const message = await anthropic.messages.create({
      model: EXTRACTION_MODEL,
      max_tokens: 1024,
      output_config: { format: { type: "json_schema", schema: EXTRACTION_SCHEMA } },
      messages: [
        {
          role: "user",
          content: [fileBlock(mime, base64), { type: "text", text: EXTRACTION_PROMPT }],
        },
      ],
    });
    if (message.stop_reason === "refusal") {
      return NextResponse.json({ error: "La extracción fue rechazada" }, { status: 422 });
    }
    const text = message.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      throw new Error("Respuesta sin bloque de texto");
    }
    raw = JSON.parse(text.text) as ExtraccionRaw;
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
