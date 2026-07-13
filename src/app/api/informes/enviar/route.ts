import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import { requireEnv } from "@/lib/server/env";
import { BUCKET_INFORMES } from "@/lib/server/storage";
import type { Destinatario, Informe } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/informes/enviar  — sellium-brief-desarrollo.md §4
 *
 * Emails the generated PDF to the recipient contact and marks the report
 * 'enviado'. Provider key (RESEND_API_KEY) and sender (SELLIUM_FROM_EMAIL) are
 * server-only.
 */
interface EnviarBody {
  informeId: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailHtml(cliente: string, ejercicio: number): string {
  return [
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#241F16;line-height:1.55;max-width:520px">`,
    `<p style="font-family:Georgia,serif;font-size:20px;font-weight:600;margin:0 0 16px">Sellium</p>`,
    `<p style="margin:0 0 12px">Hola,</p>`,
    `<p style="margin:0 0 12px">Adjuntamos el informe de huella de carbono de <strong>${cliente}</strong> correspondiente al ejercicio ${ejercicio}, calculado con los factores oficiales del MITECO y la metodología GHG Protocol.</p>`,
    `<p style="margin:0 0 12px">El PDF va adjunto a este correo.</p>`,
    `<p style="margin:16px 0 0;font-size:12px;color:#7C7368">Sellium · Informes de huella de carbono para pymes</p>`,
    `</div>`,
  ].join("");
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: EnviarBody;
  try {
    body = (await req.json()) as EnviarBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.informeId || !body.email || !EMAIL_RE.test(body.email)) {
    return NextResponse.json(
      { error: "informeId y un email válido son obligatorios" },
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
    return NextResponse.json({ error: "Informe no encontrado" }, { status: 404 });
  }
  if (informe.profile_id !== user.id) {
    return NextResponse.json({ error: "Informe ajeno" }, { status: 403 });
  }
  if (!informe.pdf_url) {
    return NextResponse.json({ error: "El informe aún no tiene PDF" }, { status: 409 });
  }

  // Download the PDF bytes to attach them.
  const { data: blob, error: dlErr } = await db.storage
    .from(BUCKET_INFORMES)
    .download(informe.pdf_url);
  if (dlErr || !blob) {
    return NextResponse.json({ error: `No se pudo leer el PDF: ${dlErr?.message}` }, { status: 502 });
  }
  const pdf = Buffer.from(await blob.arrayBuffer());

  const { data: destinatario } = await db
    .from("destinatarios")
    .select("*")
    .eq("id", informe.destinatario_id)
    .single<Destinatario>();
  const cliente = destinatario?.nombre_cliente_grande ?? "tu cliente";

  // Send via Resend (key + sender read here, never client-side).
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const from = requireEnv("SELLIUM_FROM_EMAIL");
  const { error: sendErr } = await resend.emails.send({
    from,
    to: body.email,
    // Replies must reach the sender (the pyme), not our no-mailbox address.
    ...(user.email ? { replyTo: user.email } : {}),
    subject: `Informe de huella de carbono · ${cliente} · ${informe.ejercicio}`,
    html: emailHtml(cliente, informe.ejercicio),
    attachments: [{ filename: `Informe_${informe.ejercicio}.pdf`, content: pdf }],
  });
  if (sendErr) {
    return NextResponse.json({ error: `No se pudo enviar: ${sendErr.message}` }, { status: 502 });
  }

  const { data: updated } = await db
    .from("informes")
    .update({ estado: "enviado", enviado_a_email: body.email })
    .eq("id", informe.id)
    .select("*")
    .single<Informe>();

  return NextResponse.json({ informe: updated ?? informe });
}

export type { EnviarBody };
