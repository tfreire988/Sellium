"use client";

import { useState } from "react";

/**
 * "Enviar al cliente" control on the report view. Posts to /api/informes/enviar
 * and reflects the result inline. Starts collapsed unless the report was
 * already sent.
 */
export function EnviarInforme({
  informeId,
  yaEnviadoA,
}: {
  informeId: string;
  yaEnviadoA: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [enviadoA, setEnviadoA] = useState<string | null>(yaEnviadoA);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/informes/enviar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ informeId, email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar");
      setEnviadoA(email.trim());
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setSending(false);
    }
  }

  if (enviadoA && !open) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-mono text-[12.5px] text-verificado">
          ✓ Enviado a {enviadoA}
        </span>
        <button
          onClick={() => setOpen(true)}
          className="font-mono text-[12.5px] text-ink-muted hover:text-ink-text"
        >
          Reenviar
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-tl-[6px] rounded-tr-[9px] rounded-br-[5px] rounded-bl-[8px] border border-ink-muted/45 px-[22px] py-3 text-[15px] font-semibold text-ink-text hover:border-sello"
      >
        Enviar al cliente
      </button>
    );
  }

  return (
    <form onSubmit={send} className="flex w-full max-w-[440px] flex-col gap-2.5">
      <div className="flex gap-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@delcliente.com"
          className="flex-1 rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-ink-muted/35 bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-ink-text outline-none placeholder:text-ink-muted focus:border-sello"
        />
        <button
          type="submit"
          disabled={sending}
          className="shrink-0 rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello px-5 py-2.5 text-[14px] font-semibold text-ink hover:bg-sello-hover disabled:opacity-50"
        >
          {sending ? "Enviando…" : "Enviar"}
        </button>
      </div>
      {error ? <p className="m-0 text-[13px] text-error">{error}</p> : null}
    </form>
  );
}
