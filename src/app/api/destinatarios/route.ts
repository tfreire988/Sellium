import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import type { Destinatario } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/destinatarios — create the "big client" the report is addressed to.
 * Body: { nombre: string, clienteGestionadoId?: string }.
 */
interface CrearBody {
  nombre: string;
  clienteGestionadoId?: string;
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  let body: CrearBody;
  try {
    body = (await req.json()) as CrearBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const nombre = body.nombre?.trim();
  if (!nombre) {
    return NextResponse.json({ error: "El nombre del cliente es obligatorio" }, { status: 400 });
  }

  const { data, error } = await getServiceClient()
    .from("destinatarios")
    .insert({
      profile_id: user.id,
      nombre_cliente_grande: nombre,
      cliente_gestionado_id: body.clienteGestionadoId ?? null,
    })
    .select("*")
    .single<Destinatario>();

  if (error || !data) {
    return NextResponse.json({ error: `No se pudo crear: ${error?.message}` }, { status: 500 });
  }
  return NextResponse.json({ destinatario: data }, { status: 201 });
}
