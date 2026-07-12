"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import type { TipoFactura } from "@/lib/db-types";

type Estado = "subiendo" | "extrayendo" | "ok" | "revision_manual" | "error";

interface Item {
  key: string;
  nombre: string;
  tipo: TipoFactura;
  estado: Estado;
  facturaId?: string;
  detalle?: string;
}

const TIPOS: { value: TipoFactura; label: string }[] = [
  { value: "electricidad", label: "Electricidad" },
  { value: "gas", label: "Gas" },
  { value: "combustible", label: "Combustible" },
  { value: "otro", label: "Otro" },
];

const BADGE: Record<Estado, { label: string; cls: string }> = {
  subiendo: { label: "Subiendo…", cls: "text-paper-muted border-paper-border" },
  extrayendo: { label: "Leyendo…", cls: "text-paper-muted border-paper-border" },
  ok: { label: "OK", cls: "text-verificado border-verificado" },
  revision_manual: { label: "Revisar", cls: "text-alerta border-alerta" },
  error: { label: "Error", cls: "text-error border-error" },
};

export default function NuevoInformePage() {
  const [tipo, setTipo] = useState<TipoFactura>("electricidad");
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function patch(key: string, next: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...next } : it)));
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const key = crypto.randomUUID();
      setItems((prev) => [...prev, { key, nombre: file.name, tipo, estado: "subiendo" }]);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("tipo", tipo);
        const up = await fetch("/api/facturas/subir", { method: "POST", body: fd });
        const upJson = await up.json();
        if (!up.ok) {
          patch(key, { estado: "error", detalle: upJson.error });
          continue;
        }
        const facturaId = upJson.factura.id as string;
        patch(key, { estado: "extrayendo", facturaId });

        const ex = await fetch("/api/facturas/extraer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ facturaId }),
        });
        const exJson = await ex.json();
        if (!ex.ok) {
          patch(key, { estado: "error", detalle: exJson.error });
          continue;
        }
        const estado = exJson.factura.estado_extraccion as Estado;
        patch(key, {
          estado: estado === "ok" ? "ok" : "revision_manual",
          detalle: (exJson.motivos as string[] | undefined)?.join(" · "),
        });
      } catch (err) {
        patch(key, { estado: "error", detalle: err instanceof Error ? err.message : "fallo" });
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  const listas = items.filter((i) => i.estado === "ok").length;

  return (
    <div className="min-h-screen bg-ink text-ink-text">
      <nav className="mx-auto flex max-w-[900px] items-center justify-between px-5 py-[18px]">
        <Link href="/panel" className="flex items-center gap-2.5 no-underline hover:no-underline">
          <LogoMark size={28} />
          <Wordmark className="text-[19px] text-ink-text" />
        </Link>
        <Link href="/panel" className="font-mono text-[12.5px] text-ink-muted">
          ← Volver al panel
        </Link>
      </nav>

      <main className="mx-auto max-w-[900px] px-5 py-8">
        <p className="m-0 mb-2 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase">
          Nuevo informe · Paso 1 de 2
        </p>
        <h1 className="m-0 mb-1.5 font-serif text-[32px] font-semibold">Sube tus facturas</h1>
        <p className="m-0 mb-7 max-w-[60ch] text-[15px] leading-[1.6] text-[#C7CCC2]">
          Foto o PDF de luz, gas o combustible del último año. Elige el tipo, súbelas y
          las leemos con los factores oficiales del MITECO.
        </p>

        {/* Tipo selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTipo(t.value)}
              className={`rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border px-3.5 py-2 text-[13.5px] font-medium ${
                tipo === t.value
                  ? "border-sello bg-sello/20 text-ink-text"
                  : "border-ink-muted/35 text-ink-muted hover:border-ink-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dropzone */}
        <button
          onClick={() => inputRef.current?.click()}
          className="mb-6 flex w-full flex-col items-center justify-center gap-2 rounded-tl-[10px] rounded-tr-[6px] rounded-br-[9px] rounded-bl-[6px] border-[1.5px] border-dashed border-ink-muted/40 bg-white/[0.02] px-6 py-10 hover:border-sello"
        >
          <span className="font-mono text-[12px] tracking-[1.5px] text-ink-muted">
            SUELTA AQUÍ TUS FACTURAS · {TIPOS.find((t) => t.value === tipo)?.label}
          </span>
          <span className="text-[13px] text-[#C7CCC2]">
            PDF o imagen · máx. 15 MB · puedes subir varias
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </button>

        {/* Uploaded list */}
        {items.length > 0 ? (
          <div className="mb-8 flex flex-col gap-2">
            {items.map((it) => (
              <div
                key={it.key}
                className="flex items-center justify-between gap-3 rounded-tl-[8px] rounded-tr-[4px] rounded-br-[9px] rounded-bl-[4px] border border-ink-muted/20 bg-white/[0.02] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="m-0 truncate text-[14px] text-ink-text">{it.nombre}</p>
                  <p className="m-0 text-[12px] text-ink-muted">
                    {TIPOS.find((t) => t.value === it.tipo)?.label}
                    {it.detalle ? ` · ${it.detalle}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] border px-2.5 py-1 font-mono text-[11px] ${BADGE[it.estado].cls}`}
                >
                  {BADGE[it.estado].label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {/* Next step (recipient) — wired next */}
        <div className="flex items-center gap-4">
          <span
            aria-disabled
            className="inline-block cursor-not-allowed rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello/40 px-[22px] py-3 text-[15px] font-semibold text-ink-text"
            title="Disponible en el siguiente paso"
          >
            Continuar: elegir cliente — próximamente
          </span>
          <span className="font-mono text-[12.5px] text-ink-muted">
            {listas} factura{listas === 1 ? "" : "s"} lista{listas === 1 ? "" : "s"}
          </span>
        </div>
      </main>
    </div>
  );
}
