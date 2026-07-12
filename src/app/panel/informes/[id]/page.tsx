import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/server/supabase-auth";
import { LogoMark, Wordmark } from "@/components/Logo";
import { MiniStamp } from "@/components/MiniStamp";
import { EnviarInforme } from "@/components/panel/EnviarInforme";
import type { Destinatario, Informe } from "@/lib/db-types";

export const metadata = { title: "Informe — Sellium" };

function fmt(n: number | null): string {
  if (n == null) return "—";
  return `${n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} t CO2e`;
}

export default async function InformePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: informe } = await supabase
    .from("informes")
    .select("*")
    .eq("id", id)
    .single<Informe>();
  if (!informe) notFound();

  const { data: destinatario } = await supabase
    .from("destinatarios")
    .select("*")
    .eq("id", informe.destinatario_id)
    .single<Destinatario>();

  const total =
    (informe.alcance1_tco2e ?? 0) +
    (informe.alcance2_tco2e ?? 0) +
    (informe.alcance3_estimado_tco2e ?? 0);

  return (
    <div className="min-h-screen bg-ink text-ink-text">
      <nav className="mx-auto flex max-w-[820px] items-center justify-between px-5 py-[18px]">
        <Link href="/panel" className="flex items-center gap-2.5 no-underline hover:no-underline">
          <LogoMark size={28} />
          <Wordmark className="text-[19px] text-ink-text" />
        </Link>
        <Link href="/panel" className="font-mono text-[12.5px] text-ink-muted">
          ← Volver al panel
        </Link>
      </nav>

      <main className="mx-auto max-w-[820px] px-5 py-8">
        <p className="m-0 mb-2 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase">
          Informe · Ejercicio {informe.ejercicio}
        </p>
        <h1 className="m-0 mb-7 font-serif text-[30px] font-semibold">
          {destinatario?.nombre_cliente_grande ?? "Informe de huella de carbono"}
        </h1>

        <div className="relative rounded-tl-[12px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] bg-paper px-8 py-8 text-paper-text shadow-[0_18px_44px_rgba(15,10,4,0.45)]">
          <p className="m-0 mb-1 font-mono text-[10.5px] tracking-[1.5px] text-paper-muted uppercase">
            Informe de huella de carbono · Ejercicio {informe.ejercicio}
          </p>
          <p className="m-0 mb-6 font-serif text-[22px] font-semibold">
            Destinatario: {destinatario?.nombre_cliente_grande ?? "—"}
          </p>

          <div className="grid grid-cols-[1fr_auto] gap-y-3 text-[15px]">
            <span>Alcance 1 · Combustión directa</span>
            <span className="text-right font-mono">{fmt(informe.alcance1_tco2e)}</span>
            <span>Alcance 2 · Electricidad</span>
            <span className="text-right font-mono">{fmt(informe.alcance2_tco2e)}</span>
            <span className="text-paper-muted">Alcance 3 · Estimación</span>
            <span className="text-right font-mono text-paper-muted">
              {fmt(informe.alcance3_estimado_tco2e)}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t-2 border-paper-text pt-3.5">
            <span className="text-[16px] font-semibold">Total</span>
            <span className="font-mono text-[24px] font-medium">{fmt(total)}</span>
          </div>
          <p className="m-0 mt-4 font-mono text-[11px] text-paper-muted">
            {informe.metodologia}
          </p>

          <div className="absolute -top-5 -right-4 -rotate-[10deg]">
            <MiniStamp size={78} word="LISTO" variant="video" />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          {informe.pdf_url ? (
            <>
              <a
                href={`/api/informes/${informe.id}/descargar`}
                className="inline-block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello px-[22px] py-3 text-[15px] font-semibold text-ink no-underline hover:bg-sello-hover hover:text-ink hover:no-underline"
              >
                Descargar PDF
              </a>
              <EnviarInforme informeId={informe.id} yaEnviadoA={informe.enviado_a_email} />
            </>
          ) : (
            <span className="font-mono text-[12.5px] text-alerta">PDF no disponible todavía</span>
          )}
        </div>
      </main>
    </div>
  );
}
