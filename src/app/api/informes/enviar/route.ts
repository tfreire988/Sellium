import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { requireEnv } from "@/lib/server/env";
import type { Informe } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/informes/enviar  — sellium-brief-desarrollo.md §4
 *
 * Email the generated PDF to the recipient contact and mark the report 'enviado'.
 * Email provider key (RESEND_API_KEY) is server-only.
 */

interface EnviarBody {
  informeId: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: EnviarBody;
  try {
    body = (await req.json()) as EnviarBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.informeId || !body.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json(
      { error: "informeId and a valid email are required" },
      { status: 400 },
    );
  }

  const db = getServiceClient();
  const { data: informe, error } = await db
    .from("informes")
    .select("*")
    .eq("id", body.informeId)
    .single<Informe>();

  if (error || !informe) {
    return NextResponse.json({ error: "Informe not found" }, { status: 404 });
  }
  if (!informe.pdf_url) {
    return NextResponse.json(
      { error: "Informe has no PDF yet — generate it first" },
      { status: 409 },
    );
  }

  // Fail fast if the email provider is not configured, without importing an SDK
  // that would need a key just to construct.
  requireEnv("RESEND_API_KEY");
  requireEnv("SELLIUM_FROM_EMAIL");

  // TODO(email): send the PDF via Resend, then update estado='enviado',
  // enviado_a_email=body.email.
  return NextResponse.json(
    {
      error: "Not implemented",
      detail: "Email send + status update pending.",
      informeId: informe.id,
    },
    { status: 501 },
  );
}

export type { EnviarBody };
