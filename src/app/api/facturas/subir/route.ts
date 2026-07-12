import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import { BUCKET_FACTURAS } from "@/lib/server/storage";
import type { FacturaConsumo, TipoFactura } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/facturas/subir  (multipart/form-data)
 *
 * Uploads one consumption bill to Storage and creates its facturas_consumo row
 * (estado_extraccion = 'pendiente'). Runs server-side with the service-role
 * client, so no Storage RLS policy is needed — the route enforces ownership by
 * namespacing every object under the user's id.
 *
 * Fields: `file` (the bill), `tipo` (electricidad | gas | combustible | otro).
 */

const TIPOS: TipoFactura[] = ["electricidad", "gas", "combustible", "otro"];
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Se esperaba multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  const tipo = String(form.get("tipo") ?? "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (!(TIPOS as string[]).includes(tipo)) {
    return NextResponse.json({ error: "Tipo de factura no válido" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo vacío o demasiado grande (máx. 15 MB)" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: `Formato no admitido: ${file.type}` }, { status: 400 });
  }

  const db = getServiceClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  const path = `${user.id}/${randomUUID()}-${safeName}`;

  const { error: upErr } = await db.storage
    .from(BUCKET_FACTURAS)
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (upErr) {
    return NextResponse.json({ error: `No se pudo subir: ${upErr.message}` }, { status: 502 });
  }

  const { data: factura, error: insErr } = await db
    .from("facturas_consumo")
    .insert({
      profile_id: user.id,
      tipo,
      archivo_url: path,
      estado_extraccion: "pendiente",
    })
    .select("*")
    .single<FacturaConsumo>();

  if (insErr || !factura) {
    // Best-effort cleanup so we don't leave an orphaned object in Storage.
    await db.storage.from(BUCKET_FACTURAS).remove([path]);
    return NextResponse.json({ error: `No se pudo registrar la factura: ${insErr?.message}` }, { status: 500 });
  }

  return NextResponse.json({ factura }, { status: 201 });
}
