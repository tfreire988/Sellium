import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import type { FacturaConsumo, Unidad } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/facturas/confirmar — the user confirms or corrects a bill's data by
 * hand (brief §3.3). Used when automatic extraction wasn't confident, or when
 * the Claude key isn't configured yet. Sets estado_extraccion = 'ok' so the bill
 * can feed a report.
 */
interface ConfirmarBody {
  facturaId: string;
  consumo: number;
  unidad: Unidad;
  periodo_inicio: string;
  periodo_fin: string;
}

const UNIDADES: Unidad[] = ["kWh", "m3", "litros"];
const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: ConfirmarBody;
  try {
    body = (await req.json()) as ConfirmarBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.facturaId) {
    return NextResponse.json({ error: "facturaId es obligatorio" }, { status: 400 });
  }
  if (!Number.isFinite(body.consumo) || body.consumo <= 0) {
    return NextResponse.json({ error: "El consumo debe ser un número positivo" }, { status: 400 });
  }
  if (!UNIDADES.includes(body.unidad)) {
    return NextResponse.json({ error: "Unidad no válida" }, { status: 400 });
  }
  if (!FECHA_RE.test(body.periodo_inicio) || !FECHA_RE.test(body.periodo_fin)) {
    return NextResponse.json({ error: "Fechas en formato AAAA-MM-DD" }, { status: 400 });
  }
  if (body.periodo_inicio > body.periodo_fin) {
    return NextResponse.json({ error: "El inicio es posterior al fin" }, { status: 400 });
  }

  const db = getServiceClient();
  const { data: factura, error } = await db
    .from("facturas_consumo")
    .select("*")
    .eq("id", body.facturaId)
    .single<FacturaConsumo>();
  if (error || !factura) {
    return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
  }
  if (factura.profile_id !== user.id) {
    return NextResponse.json({ error: "Factura ajena" }, { status: 403 });
  }

  const { data: updated, error: updErr } = await db
    .from("facturas_consumo")
    .update({
      consumo_extraido: body.consumo,
      unidad: body.unidad,
      periodo_inicio: body.periodo_inicio,
      periodo_fin: body.periodo_fin,
      estado_extraccion: "ok",
    })
    .eq("id", factura.id)
    .select("*")
    .single<FacturaConsumo>();

  if (updErr || !updated) {
    return NextResponse.json({ error: `No se pudo guardar: ${updErr?.message}` }, { status: 500 });
  }
  return NextResponse.json({ factura: updated });
}
