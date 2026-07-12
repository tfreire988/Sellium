"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

/**
 * Danger-zone control: delete the account after an explicit confirmation
 * (typing ELIMINAR). On success, clears the local session and returns home.
 */
export function EliminarCuenta() {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function eliminar() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cuenta/eliminar", { method: "POST" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "No se pudo eliminar la cuenta");
      }
      // The auth user is gone; clear any local session and leave.
      await createClient().auth.signOut().catch(() => {});
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 rounded-tl-[10px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[6px] border border-error/40 bg-error/[0.06] px-6 py-5">
      <p className="m-0 mb-1 font-serif text-[16px] font-semibold text-ink-text">Eliminar cuenta</p>
      <p className="m-0 mb-4 max-w-[60ch] text-[13.5px] leading-[1.55] text-ink-muted">
        Borra tu cuenta y todos tus datos (perfil, clientes, facturas e informes). Esta
        acción es permanente y no se puede deshacer.
      </p>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-error/60 px-4 py-2 text-[13.5px] font-medium text-error hover:bg-error/10"
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="flex flex-col gap-2.5">
          <p className="m-0 text-[13px] text-ink-muted">
            Escribe <span className="font-mono font-medium text-ink-text">ELIMINAR</span> para
            confirmar.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-ink-muted/35 bg-white/[0.03] px-3.5 py-2 text-[14px] text-ink-text outline-none focus:border-error"
              placeholder="ELIMINAR"
            />
            <button
              onClick={eliminar}
              disabled={texto !== "ELIMINAR" || loading}
              className="rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] bg-error px-4 py-2 text-[13.5px] font-semibold text-ink-text hover:opacity-90 disabled:opacity-40"
            >
              {loading ? "Eliminando…" : "Confirmar borrado"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setTexto("");
                setError(null);
              }}
              className="px-4 py-2 text-[13.5px] text-ink-muted hover:text-ink-text"
            >
              Cancelar
            </button>
          </div>
          {error ? <p className="m-0 text-[13px] text-error">{error}</p> : null}
        </div>
      )}
    </div>
  );
}
