import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import { signedInformeURL } from "@/lib/server/storage";
import type { Informe } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * GET /api/informes/:id/descargar — redirect to a short-lived signed URL for the
 * report PDF. The PDF bucket is private; this is the only way to hand it out,
 * and only to the owner.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const { data: informe, error } = await getServiceClient()
    .from("informes")
    .select("*")
    .eq("id", id)
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

  const url = await signedInformeURL(informe.pdf_url, 60 * 5);
  return NextResponse.redirect(url, { status: 302 });
}
