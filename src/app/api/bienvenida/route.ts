import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceClient } from "@/lib/server/supabase";
import { optionalEnv } from "@/lib/server/env";

export const runtime = "nodejs";

/**
 * POST /api/bienvenida — best-effort onboarding email right after sign-up.
 *
 * Called fire-and-forget from the registro page (no session yet when email
 * confirmation is on). To stop it being an open "email anyone" endpoint, the
 * route verifies against Supabase that the user id exists, the email matches,
 * and the account was created just now (< 15 min). Any mismatch → silent no-op,
 * never an error the attacker can probe.
 */
interface BienvenidaBody {
  userId: string;
  email: string;
}

function welcomeHtml(nombre: string): string {
  const saludo = nombre ? `Hola, ${nombre}` : "Hola";
  return [
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#241F16;line-height:1.55;max-width:520px">`,
    `<p style="font-family:Georgia,serif;font-size:22px;font-weight:600;margin:0 0 18px">Sellium</p>`,
    `<p style="margin:0 0 12px">${saludo},</p>`,
    `<p style="margin:0 0 12px">Gracias por unirte a la beta de Sellium. Ya puedes generar tu informe de huella de carbono, listo para entregar a tu cliente:</p>`,
    `<ol style="margin:0 0 16px;padding-left:20px">`,
    `<li style="margin-bottom:6px">Sube tus facturas de luz, gas o combustible.</li>`,
    `<li style="margin-bottom:6px">Las leemos y calculamos con los factores oficiales del MITECO.</li>`,
    `<li>Descargas el PDF, o se lo enviamos a tu cliente por ti.</li>`,
    `</ol>`,
    `<p style="margin:0 0 20px"><a href="https://www.sellium.eu/panel/nuevo" style="display:inline-block;background:#a05c28;color:#f2eee0;text-decoration:none;font-weight:600;padding:11px 22px;border-radius:8px">Crear mi primer informe</a></p>`,
    `<p style="margin:0 0 12px;font-size:13px;color:#7C7368">Si aún no has confirmado tu correo, revisa tu bandeja y pulsa el enlace de confirmación.</p>`,
    `<p style="margin:16px 0 0;font-size:12px;color:#7C7368">Sellium · Informes de huella de carbono para pymes · Gratis durante la beta</p>`,
    `</div>`,
  ].join("");
}

export async function POST(req: Request) {
  let body: BienvenidaBody;
  try {
    body = (await req.json()) as BienvenidaBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.userId || !body.email) {
    return NextResponse.json({ error: "userId y email son obligatorios" }, { status: 400 });
  }

  // Email is best-effort: if Resend isn't configured, do nothing (don't block).
  const apiKey = optionalEnv("RESEND_API_KEY");
  const from = optionalEnv("SELLIUM_FROM_EMAIL");
  if (!apiKey || !from) {
    return NextResponse.json({ ok: true, skipped: "email-no-configurado" });
  }

  // Verify the account genuinely just registered (anti-abuse). Any failure is a
  // silent success so this endpoint can't be used to probe or to spam victims.
  const db = getServiceClient();
  const { data, error } = await db.auth.admin.getUserById(body.userId);
  const u = data?.user;
  if (error || !u || !u.email) return NextResponse.json({ ok: true });
  if (u.email.toLowerCase() !== body.email.toLowerCase()) return NextResponse.json({ ok: true });
  const creado = new Date(u.created_at ?? 0).getTime();
  if (!creado || Date.now() - creado > 15 * 60 * 1000) return NextResponse.json({ ok: true });

  const nombre =
    typeof u.user_metadata?.nombre_empresa === "string" ? u.user_metadata.nombre_empresa : "";

  try {
    await new Resend(apiKey).emails.send({
      from,
      to: u.email,
      subject: "Bienvenido a Sellium",
      html: welcomeHtml(nombre),
    });
  } catch {
    // Never let a mail hiccup surface to the just-registered user.
    return NextResponse.json({ ok: true, sent: false });
  }
  return NextResponse.json({ ok: true, sent: true });
}
