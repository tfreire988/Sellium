import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import { uploadInformePDF } from "@/lib/server/storage";
import { renderInformePDF } from "@/lib/pdf/render";
import { calcularInforme } from "@/lib/emisiones";
import { buildInformeData, refInforme } from "@/lib/informe";
import type {
  Destinatario,
  FacturaConsumo,
  FactorEmision,
  Informe,
  Profile,
} from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/informes/generar  — sellium-brief-desarrollo.md §3.4–3.6
 *
 * Full flow: authenticate → load emisor + destinatario + bills + factors →
 * compute Scope 1/2 (+ optional Scope 3 estimate) → render the PDF → upload to
 * Storage → insert the `informes` row → return it.
 */

interface GenerarBody {
  destinatarioId: string;
  facturaIds: string[];
  ejercicio?: number;
  /** Optional annual third-party spend for the simplified Scope 3 estimate. */
  gastoAlcance3?: number;
  /** Average sectoral factor (kgCO2e per currency unit) for Scope 3. */
  factorAlcance3?: number;
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: GenerarBody;
  try {
    body = (await req.json()) as GenerarBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.destinatarioId || !Array.isArray(body.facturaIds) || body.facturaIds.length === 0) {
    return NextResponse.json(
      { error: "destinatarioId and a non-empty facturaIds[] are required" },
      { status: 400 },
    );
  }

  const db = getServiceClient();

  // Reporting year: explicit if given, else the latest factor set available.
  // MITECO publishes each year's factors in arrears, so "latest loaded" is the
  // correct default — and it guarantees factors exist for the chosen year.
  let ejercicio = body.ejercicio;
  if (ejercicio == null) {
    const { data: latest } = await db
      .from("factores_emision")
      .select("ejercicio")
      .order("ejercicio", { ascending: false })
      .limit(1)
      .maybeSingle<{ ejercicio: number }>();
    ejercicio = latest?.ejercicio ?? new Date().getFullYear();
  }

  const [profileRes, destRes, facturasRes, factoresRes] = await Promise.all([
    db.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    db.from("destinatarios").select("*").eq("id", body.destinatarioId).single<Destinatario>(),
    db.from("facturas_consumo").select("*").in("id", body.facturaIds).returns<FacturaConsumo[]>(),
    db.from("factores_emision").select("*").eq("ejercicio", ejercicio).returns<FactorEmision[]>(),
  ]);

  if (profileRes.error || !profileRes.data) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
  }
  if (destRes.error || !destRes.data) {
    return NextResponse.json({ error: "Destinatario not found" }, { status: 404 });
  }
  const emisor = profileRes.data;
  const destinatario = destRes.data;

  // The destinatario must belong to the caller (defence in depth alongside RLS).
  if (destinatario.profile_id !== user.id) {
    return NextResponse.json({ error: "Destinatario ajeno" }, { status: 403 });
  }

  const facturas = facturasRes.data ?? [];
  const factores = factoresRes.data ?? [];

  if (factores.length === 0) {
    return NextResponse.json(
      { error: `No hay factores de emisión cargados para el ejercicio ${ejercicio}` },
      { status: 409 },
    );
  }

  // Never compute from a bill still awaiting manual review (brief §3.3).
  const enRevision = facturas.filter((f) => f.estado_extraccion !== "ok");
  if (enRevision.length > 0) {
    return NextResponse.json(
      { error: "Some bills are not confirmed yet", revisar: enRevision.map((f) => f.id) },
      { status: 409 },
    );
  }

  const calculo = calcularInforme(
    facturas,
    factores,
    ejercicio,
    body.gastoAlcance3,
    body.factorAlcance3,
  );

  // Insert the row first (draft) to obtain the id used in the storage path and ref.
  const { data: inserted, error: insertErr } = await db
    .from("informes")
    .insert({
      profile_id: user.id,
      destinatario_id: destinatario.id,
      cliente_gestionado_id: destinatario.cliente_gestionado_id,
      ejercicio,
      alcance1_tco2e: calculo.alcance1_tco2e,
      alcance2_tco2e: calculo.alcance2_tco2e,
      alcance3_estimado_tco2e: calculo.alcance3_estimado_tco2e,
      estado: "borrador",
    })
    .select("*")
    .single<Informe>();

  if (insertErr || !inserted) {
    return NextResponse.json(
      { error: `No se pudo crear el informe: ${insertErr?.message}` },
      { status: 500 },
    );
  }

  // Cite the factor source actually used (first row of the ejercicio's set).
  const fuenteFactores = factores[0]?.fuente ?? `MITECO ${ejercicio}`;

  const pdf = await renderInformePDF(
    buildInformeData({
      emisor: { nombre: emisor.nombre_empresa, nif: emisor.nif },
      destinatario: destinatario.nombre_cliente_grande,
      ejercicio,
      calculo,
      factorAnio: ejercicio,
      fuenteFactores,
      numero: refInforme(ejercicio, seqFromId(inserted.id)),
    }),
  );

  const pdfPath = await uploadInformePDF(user.id, inserted.id, pdf);

  const { data: updated, error: updateErr } = await db
    .from("informes")
    .update({ pdf_url: pdfPath, estado: "listo" })
    .eq("id", inserted.id)
    .select("*")
    .single<Informe>();

  if (updateErr || !updated) {
    return NextResponse.json(
      { error: `Informe generado pero no se pudo actualizar: ${updateErr?.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { informe: updated, sinFactor: calculo.sinFactor },
    { status: 201 },
  );
}

/** Small deterministic sequence hint from a uuid, just for the human-facing ref. */
function seqFromId(id: string): number {
  const hex = id.replace(/-/g, "").slice(0, 6);
  return parseInt(hex, 16) % 10000;
}

export type { GenerarBody };
