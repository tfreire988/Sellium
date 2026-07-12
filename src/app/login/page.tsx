"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { AuthShell, authInputClass, authButtonClass } from "@/components/auth/AuthShell";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/panel";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Accede a tu panel para generar y gestionar informes."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-link">
            Crear una
          </Link>
        </>
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
        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-paper-muted">
          <span className="flex items-center justify-between">
            Contraseña
            <Link href="/recuperar" className="text-[12px] font-normal text-link">
              ¿La olvidaste?
            </Link>
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="m-0 text-[13px] text-error">{error}</p> : null}
        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
