"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { AuthShell, authInputClass, authButtonClass } from "@/components/auth/AuthShell";
import type { TipoCuenta } from "@/lib/db-types";

export default function RegistroPage() {
  const router = useRouter();
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [nif, setNif] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>("pyme");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Metadata → the handle_new_user trigger copies it into public.profiles.
      options: { data: { nombre_empresa: nombreEmpresa, nif, tipo_cuenta: tipoCuenta } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // If email confirmation is on, there's no session yet — ask them to confirm.
    if (!data.session) {
      setCheckEmail(true);
      return;
    }
    router.push("/panel");
    router.refresh();
  }

  if (checkEmail) {
    return (
      <AuthShell
        title="Revisa tu correo"
        subtitle="Te hemos enviado un enlace para confirmar tu cuenta. Ábrelo y ya podrás entrar."
        footer={
          <Link href="/login" className="text-link">
            Volver a entrar
          </Link>
        }
      >
        <p className="m-0 text-[14px] leading-[1.55] text-paper-muted">
          Enviado a <span className="font-medium text-paper-text">{email}</span>.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Crear cuenta"
      subtitle="Empieza a generar informes de huella de carbono para tus clientes."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-link">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-paper-muted">
          Nombre de la empresa
          <input
            type="text"
            required
            value={nombreEmpresa}
            onChange={(e) => setNombreEmpresa(e.target.value)}
            className={authInputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-paper-muted">
          NIF <span className="text-paper-muted/70">(opcional)</span>
          <input
            type="text"
            value={nif}
            onChange={(e) => setNif(e.target.value)}
            className={authInputClass}
          />
        </label>
        <fieldset className="m-0 flex gap-2 border-0 p-0">
          {(["pyme", "gestoria"] as TipoCuenta[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTipoCuenta(t)}
              className={`flex-1 rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border px-3 py-2 text-[13.5px] font-medium ${
                tipoCuenta === t
                  ? "border-paper-text bg-paper-text text-ink-text"
                  : "border-paper-border bg-paper-2 text-paper-muted"
              }`}
            >
              {t === "pyme" ? "Soy pyme" : "Soy gestoría"}
            </button>
          ))}
        </fieldset>
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-paper-muted">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-paper-muted">
          Contraseña <span className="text-paper-muted/70">(mín. 6 caracteres)</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className="m-0 text-[13px] text-error">{error}</p> : null}
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Creando…" : "Crear cuenta"}
        </button>
      </form>
    </AuthShell>
  );
}
