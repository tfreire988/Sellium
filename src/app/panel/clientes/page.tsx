import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/server/supabase-auth";
import { LogoMark, Wordmark } from "@/components/Logo";
import { ClientesManager, type ClienteRow, type EstadoCliente } from "@/components/panel/ClientesManager";
import type { ClienteGestionado, Informe, Profile } from "@/lib/db-types";

export const metadata = { title: "Clientes — Sellium" };

/** Best status among a managed client's reports (or 'sin_informe'). */
function estadoDe(informes: Informe[]): EstadoCliente {
  if (informes.some((i) => i.estado === "enviado")) return "enviado";
  if (informes.some((i) => i.estado === "listo")) return "listo";
  if (informes.some((i) => i.estado === "borrador")) return "borrador";
  return "sin_informe";
}

export default async function ClientesPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Gestoría-only area.
  if (profile?.tipo_cuenta !== "gestoria") redirect("/panel");

  const { data: clientes } = await supabase
    .from("clientes_gestionados")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ClienteGestionado[]>();

  const { data: informes } = await supabase
    .from("informes")
    .select("*")
    .returns<Informe[]>();

  const porCliente = new Map<string, Informe[]>();
  for (const inf of informes ?? []) {
    if (!inf.cliente_gestionado_id) continue;
    const arr = porCliente.get(inf.cliente_gestionado_id) ?? [];
    arr.push(inf);
    porCliente.set(inf.cliente_gestionado_id, arr);
  }

  const rows: ClienteRow[] = (clientes ?? []).map((c) => ({
    id: c.id,
    nombre: c.nombre_empresa,
    email: c.email_contacto,
    estado: estadoDe(porCliente.get(c.id) ?? []),
  }));

  return (
    <div className="min-h-screen bg-ink text-ink-text">
      <nav className="mx-auto flex max-w-[900px] items-center justify-between px-5 py-[18px]">
        <Link href="/panel" className="flex items-center gap-2.5 no-underline hover:no-underline">
          <LogoMark size={28} />
          <Wordmark className="text-[19px] text-ink-text" />
        </Link>
        <Link href="/panel" className="font-mono text-[12.5px] text-ink-muted">
          ← Volver al panel
        </Link>
      </nav>

      <main className="mx-auto max-w-[900px] px-5 py-8">
        <p className="m-0 mb-2 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase">
          Para gestorías y asesorías
        </p>
        <h1 className="m-0 mb-1.5 font-serif text-[32px] font-semibold">Tus clientes</h1>
        <p className="m-0 mb-7 max-w-[62ch] text-[15px] leading-[1.6] text-[#C7CCC2]">
          Gestiona los informes de todos tus clientes desde un mismo panel: el estado de cada
          uno y un enlace para que suban sus facturas sin perseguirles por email.
        </p>

        <ClientesManager initial={rows} />
      </main>
    </div>
  );
}
