import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { calcularInforme } from "@/lib/emisiones";
import type {
  Destinatario,
  FacturaConsumo,
  FactorEmision,
} from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/informes/generar  — sellium-brief-desarrollo.md §3.4–3.6
 *
 * Given a destinatario and a set of bills, compute Scope 1/2 (+ optional Scope 3
 * estimate) using the in-house MITECO factors for the reporting year, render the
 * PDF, upload it to Storage, and insert the `informes` row.
 *
 * The maths runs through the pure `calcularInforme` helper; only the PDF render
 * + Storage upload remain to be wired.
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

  const ejercicio = body.ejercicio ?? new Date().getFullYear();
  const db = getServiceClient();

  // Load destinatario, bills, and the factor set for the reporting year.
  const [destRes, facturasRes, factoresRes] = await Promise.all([
    db.from("destinatarios").select("*").eq("id", body.destinatarioId).single<Destinatario>(),
    db.from("facturas_consumo").select("*").in("id", body.facturaIds).returns<FacturaConsumo[]>(),
    db.from("factores_emision").select("*").eq("ejercicio", ejercicio).returns<FactorEmision[]>(),
  ]);

  if (destRes.error || !destRes.data) {
    return NextResponse.json({ error: "Destinatario not found" }, { status: 404 });
  }
  const facturas = facturasRes.data ?? [];
  const factores = factoresRes.data ?? [];

  // Guard: never compute from a bill still awaiting manual review (brief §3.3).
  const enRevision = facturas.filter((f) => f.estado_extraccion !== "ok");
  if (enRevision.length > 0) {
    return NextResponse.json(
      {
        error: "Some bills are not confirmed yet",
        revisar: enRevision.map((f) => f.id),
      },
      { status: 409 },
    );
  }

  const resultado = calcularInforme(
    facturas,
    factores,
    ejercicio,
    body.gastoAlcance3,
    body.factorAlcance3,
  );

  // TODO(pdf): render the formal PDF (no hand-drawn imperfection — brief diseño §5),
  // upload to Storage, then insert the `informes` row with pdf_url + estado 'listo'.
  return NextResponse.json(
    {
      error: "Not implemented",
      detail: "Calculation runs; PDF render + Storage upload + insert pending.",
      preview: { ejercicio, ...resultado },
    },
    { status: 501 },
  );
}

export type { GenerarBody };
