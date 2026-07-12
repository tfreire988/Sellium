import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";

export const runtime = "nodejs";

/**
 * POST /api/cuenta/eliminar — permanently delete the current user's account.
 *
 * Uses the service-role admin API to delete the auth user; the ON DELETE CASCADE
 * foreign keys then remove the profile and every row tied to it (destinatarios,
 * facturas_consumo, informes, clientes_gestionados). Storage objects are left as
 * orphans for now (no DB cascade reaches them) — a scheduled cleanup can prune
 * them later.
 */
export async function POST() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { error } = await getServiceClient().auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: `No se pudo eliminar: ${error.message}` }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
