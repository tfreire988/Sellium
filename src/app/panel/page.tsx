import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/server/supabase-auth";
import { LogoMark, Wordmark } from "@/components/Logo";
import type { Profile } from "@/lib/db-types";

export const metadata = { title: "Panel — Sellium" };

const PLAN_LABEL: Record<string, string> = {
  trial: "Prueba",
  informe_unico: "Informe único",
  gestoria_mensual: "Plan gestoría",
};

export default async function PanelPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards /panel, but re-check here (defence in depth).
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

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
        <h1 className="m-0 mb-1 font-serif text-[34px] font-semibold">{nombre}</h1>
        <p className="m-0 mb-8 text-[15px] text-[#C7CCC2]">
          Plan actual:{" "}
          <span className="font-medium text-ink-text">
            {PLAN_LABEL[profile?.plan ?? "trial"] ?? "Prueba"}
          </span>
        </p>

        <div className="rounded-tl-[11px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[6px] border border-ink-muted/25 bg-white/[0.03] px-7 py-8">
          <h2 className="m-0 mb-2.5 font-serif text-[20px] font-semibold">
            Empieza tu primer informe
          </h2>
          <p className="m-0 mb-5 max-w-[56ch] text-[14.5px] leading-[1.6] text-[#C7CCC2]">
            Sube las facturas de luz, gas o combustible del último año, indica para qué
            cliente es el informe, y lo calculamos con los factores oficiales del MITECO.
          </p>
          <span className="inline-block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello/40 px-[22px] py-3 text-[15px] font-semibold text-ink-text">
            Subir facturas — próximamente
          </span>
        </div>
      </main>
    </div>
  );
}
