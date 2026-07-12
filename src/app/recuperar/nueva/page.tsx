"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { AuthShell, authInputClass, authButtonClass } from "@/components/auth/AuthShell";

/**
 * Landing page for the password-reset email link. Supabase's browser client
 * (detectSessionInUrl) turns the recovery token in the URL into a session, so
 * updateUser({ password }) here sets the new password.
 */
export default function NuevaContrasenaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(
        error.message.includes("session")
          ? "El enlace ha caducado o no es válido. Pide uno nuevo."
          : error.message,
      );
      return;
    }
    router.push("/panel");
    router.refresh();
  }

  return (
    <AuthShell
      title="Nueva contraseña"
      subtitle="Elige una contraseña nueva para tu cuenta."
      footer={
        <Link href="/login" className="text-link">
          Volver a entrar
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-paper-muted">
          Nueva contraseña <span className="text-paper-muted/70">(mín. 6 caracteres)</span>
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
          {loading ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>
    </AuthShell>
  );
}
