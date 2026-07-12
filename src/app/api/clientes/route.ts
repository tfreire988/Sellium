import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/server/supabase";
import { getAuthUser } from "@/lib/server/supabase-auth";
import type { ClienteGestionado, Profile } from "@/lib/db-types";

export const runtime = "nodejs";

/**
 * POST /api/clientes — a gestoría adds a managed end client.
 * Body: { nombre: string, email?: string, nif?: string }.
 * Only accounts with tipo_cuenta = 'gestoria' may create these.
 */
interface CrearBody {
  nombre: string;
  email?: string;
  nif?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const db = getServiceClient();
  const { data: profile } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();
  if (profile?.tipo_cuenta !== "gestoria") {
    return NextResponse.json(
      { error: "Solo las cuentas de gestoría pueden gestionar clientes" },
      { status: 403 },
    );
  }

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
  const email = body.email?.trim();
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email de contacto no válido" }, { status: 400 });
  }

  const { data, error } = await db
    .from("clientes_gestionados")
    .insert({
      gestoria_id: user.id,
      nombre_empresa: nombre,
      email_contacto: email ?? null,
      nif: body.nif?.trim() || null,
    })
    .select("*")
    .single<ClienteGestionado>();

  if (error || !data) {
    return NextResponse.json({ error: `No se pudo crear: ${error?.message}` }, { status: 500 });
  }
  return NextResponse.json({ cliente: data }, { status: 201 });
}
