"use client";

import { useState } from "react";

export type EstadoCliente = "enviado" | "listo" | "borrador" | "sin_informe";

export interface ClienteRow {
  id: string;
  nombre: string;
  email: string | null;
  estado: EstadoCliente;
}

const BADGE: Record<EstadoCliente, { label: string; cls: string }> = {
  enviado: { label: "ENVIADO", cls: "text-sello border-sello" },
  listo: { label: "LISTO", cls: "text-verificado border-verificado" },
  borrador: { label: "BORRADOR", cls: "text-paper-muted border-paper-border" },
  sin_informe: { label: "", cls: "" },
};

export function ClientesManager({ initial }: { initial: ClienteRow[] }) {
  const [clientes, setClientes] = useState<ClienteRow[]>(initial);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) {
      setError("Indica el nombre del cliente.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo crear");
      setClientes((prev) => [
        { id: json.cliente.id, nombre: json.cliente.nombre_empresa, email: json.cliente.email_contacto, estado: "sin_informe" },
        ...prev,
      ]);
      setNombre("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-tl-[11px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] border border-paper-border bg-paper-2 px-6 py-6 text-paper-text shadow-[0_14px_32px_rgba(60,45,20,0.18)]">
      <p className="m-0 mb-4 font-mono text-[11px] tracking-[1.8px] text-paper-muted uppercase">
        Panel · {clientes.length} cliente{clientes.length === 1 ? "" : "s"}
      </p>

      {clientes.length === 0 ? (
        <p className="m-0 mb-5 text-[14px] text-paper-muted">
          Aún no has añadido clientes. Añade el primero abajo.
        </p>
      ) : (
        <div className="mb-5 flex flex-col">
          {clientes.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 border-t border-paper-row py-3 first:border-t-0"
            >
              <div className="min-w-0">
                <p className="m-0 truncate text-[14.5px] font-medium">{c.nombre}</p>
                {c.email ? (
                  <p className="m-0 font-mono text-[11.5px] text-paper-muted">{c.email}</p>
                ) : null}
              </div>
              {c.estado === "sin_informe" ? (
                <button
                  onClick={() =>
                    setAviso(
                      "El enlace de subida por email estará disponible cuando se configure el envío de correo.",
                    )
                  }
                  className="shrink-0 font-mono text-[12px] font-medium text-sello hover:underline"
                >
                  Solicitar facturas →
                </button>
              ) : (
                <span
                  className={`shrink-0 rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] border px-2.5 py-1 font-mono text-[11px] ${BADGE[c.estado].cls}`}
                >
                  {BADGE[c.estado].label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {aviso ? (
        <p className="m-0 mb-4 rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-paper-border bg-paper px-3.5 py-2.5 text-[12.5px] leading-[1.5] text-paper-muted">
          {aviso}
        </p>
      ) : null}

      <form onSubmit={add} className="flex flex-col gap-2.5 border-t border-paper-row pt-5 sm:flex-row">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del cliente"
          className="flex-1 rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-paper-border bg-paper px-3.5 py-2.5 text-[14px] outline-none focus:border-sello"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (opcional)"
          className="flex-1 rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-paper-border bg-paper px-3.5 py-2.5 text-[14px] outline-none focus:border-sello"
        />
        <button
          type="submit"
          disabled={saving}
          className="shrink-0 rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-paper-text px-5 py-2.5 text-[14px] font-semibold text-ink-text hover:bg-[#3A342A] disabled:opacity-50"
        >
          {saving ? "Añadiendo…" : "Añadir cliente"}
        </button>
      </form>
      {error ? <p className="m-0 mt-2 text-[13px] text-error">{error}</p> : null}
    </div>
  );
}
