import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/server/supabase-auth";
import { LogoMark, Wordmark } from "@/components/Logo";
import { EliminarCuenta } from "@/components/panel/EliminarCuenta";
import type { Destinatario, Informe, Profile } from "@/lib/db-types";

export const metadata = { title: "Panel — Sellium" };

const PLAN_LABEL: Record<string, string> = {
  trial: "Prueba",
  informe_unico: "Informe único",
  gestoria_mensual: "Plan gestoría",
};

const ESTADO_BADGE: Record<string, { label: string; cls: string }> = {
  borrador: { label: "BORRADOR", cls: "text-ink-muted border-ink-muted/50" },
  listo: { label: "LISTO", cls: "text-verificado border-verificado" },
  enviado: { label: "ENVIADO", cls: "text-sello border-sello" },
};

function fmtTotal(i: Informe): string {
  const total =
    (i.alcance1_tco2e ?? 0) + (i.alcance2_tco2e ?? 0) + (i.alcance3_estimado_tco2e ?? 0);
  return `${total.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} t CO2e`;
}

function fmtFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function PanelPage() {
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

  const { data: informes } = await supabase
    .from("informes")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Informe[]>();

  const lista = informes ?? [];
  const destIds = [...new Set(lista.map((i) => i.destinatario_id))];
  const { data: dests } = destIds.length
    ? await supabase.from("destinatarios").select("*").in("id", destIds).returns<Destinatario[]>()
    : { data: [] as Destinatario[] };
  const destName = new Map((dests ?? []).map((d) => [d.id, d.nombre_cliente_grande]));

  const nombre = profile?.nombre_empresa ?? "Tu empresa";
  const esGestoria = profile?.tipo_cuenta === "gestoria";

  return (
    <div className="min-h-screen bg-ink text-ink-text">
      <nav className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-[18px]">
        <div className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <Wordmark className="text-[19px]" />
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="cursor-pointer rounded-tl-[6px] rounded-tr-[4px] rounded-br-[7px] rounded-bl-[4px] border border-ink-muted/40 bg-transparent px-3.5 py-2 font-mono text-[12.5px] text-ink-muted hover:border-sello hover:text-ink-text"
          >
            Salir
          </button>
        </form>
      </nav>

      <main className="mx-auto max-w-[1000px] px-5 py-8">
        <p className="m-0 mb-2 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase">
          {esGestoria ? "Panel de gestoría" : "Tu panel"}
        </p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 mb-1 font-serif text-[34px] font-semibold">{nombre}</h1>
            <p className="m-0 text-[15px] text-[#C7CCC2]">
              Plan actual:{" "}
              <span className="font-medium text-ink-text">
                {PLAN_LABEL[profile?.plan ?? "trial"] ?? "Prueba"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {esGestoria ? (
              <Link
                href="/panel/clientes"
                className="rounded-tl-[6px] rounded-tr-[9px] rounded-br-[5px] rounded-bl-[8px] border border-ink-muted/45 px-[22px] py-3 text-[15px] font-semibold text-ink-text no-underline hover:border-sello hover:text-ink-text hover:no-underline"
              >
                Tus clientes
              </Link>
            ) : null}
            <Link
              href="/panel/nuevo"
              className="rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello px-[22px] py-3 text-[15px] font-semibold text-ink no-underline hover:bg-sello-hover hover:text-ink hover:no-underline"
            >
              + Nuevo informe
            </Link>
          </div>
        </div>

        <h2 className="m-0 mb-4 font-serif text-[20px] font-semibold">Tus informes</h2>

        {lista.length === 0 ? (
          <div className="rounded-tl-[11px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[6px] border border-ink-muted/25 bg-white/[0.03] px-7 py-8">
            <p className="m-0 mb-2.5 font-serif text-[18px] font-semibold">Aún no tienes informes</p>
            <p className="m-0 mb-5 max-w-[56ch] text-[14.5px] leading-[1.6] text-[#C7CCC2]">
              Sube las facturas de luz, gas o combustible del último año, indica para qué
              cliente es, y lo calculamos con los factores oficiales del MITECO.
            </p>
            <Link
              href="/panel/nuevo"
              className="inline-block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello px-[22px] py-3 text-[15px] font-semibold text-ink no-underline hover:bg-sello-hover hover:text-ink hover:no-underline"
            >
              Subir facturas
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink-muted/15 overflow-hidden rounded-tl-[11px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[6px] border border-ink-muted/20">
            {lista.map((i) => {
              const badge = ESTADO_BADGE[i.estado] ?? ESTADO_BADGE.borrador;
              return (
                <Link
                  key={i.id}
                  href={`/panel/informes/${i.id}`}
                  className="flex items-center justify-between gap-4 bg-white/[0.02] px-5 py-4 no-underline hover:bg-white/[0.05] hover:no-underline"
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[15px] font-medium text-ink-text">
                      {destName.get(i.destinatario_id) ?? "Cliente"}
                    </p>
                    <p className="m-0 font-mono text-[12px] text-ink-muted">
                      Ejercicio {i.ejercicio} · {fmtFecha(i.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="font-mono text-[14px] text-ink-text">{fmtTotal(i)}</span>
                    <span
                      className={`rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] border px-2.5 py-1 font-mono text-[11px] ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <EliminarCuenta />
      </main>
    </div>
  );
}
