"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { AuthShell, authInputClass, authButtonClass } from "@/components/auth/AuthShell";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar/nueva`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        title="Revisa tu correo"
        subtitle="Si hay una cuenta con ese email, te hemos enviado un enlace para restablecer la contraseña."
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
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para crear una nueva contraseña."
      footer={
        <Link href="/login" className="text-link">
          Volver a entrar
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
        {error ? <p className="m-0 text-[13px] text-error">{error}</p> : null}
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Enviando…" : "Enviar enlace"}
        </button>
      </form>
    </AuthShell>
  );
}
