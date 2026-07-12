"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark, Wordmark } from "@/components/Logo";
import type { TipoFactura, Unidad } from "@/lib/db-types";

type Estado = "subiendo" | "extrayendo" | "ok" | "revision_manual" | "error";

interface Item {
  key: string;
  nombre: string;
  tipo: TipoFactura;
  estado: Estado;
  facturaId?: string;
  detalle?: string;
  // Last saved manual values, so re-opening the form pre-fills them.
  sConsumo?: string;
  sUnidad?: Unidad;
  sIni?: string;
  sFin?: string;
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
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoFactura>("electricidad");
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cliente, setCliente] = useState("");
  const [gasto, setGasto] = useState("");
  const [generando, setGenerando] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Manual entry (used when reading isn't confident, or the AI key isn't set).
  const [editKey, setEditKey] = useState<string | null>(null);
  const [mConsumo, setMConsumo] = useState("");
  const [mUnidad, setMUnidad] = useState<Unidad>("kWh");
  const [mIni, setMIni] = useState("");
  const [mFin, setMFin] = useState("");
  const [mErr, setMErr] = useState<string | null>(null);
  const [mSaving, setMSaving] = useState(false);

  function abrirManual(it: Item) {
    setEditKey(it.key);
    setMConsumo(it.sConsumo ?? "");
    setMUnidad(it.sUnidad ?? (it.tipo === "combustible" ? "litros" : "kWh"));
    setMIni(it.sIni ?? "");
    setMFin(it.sFin ?? "");
    setMErr(null);
  }

  async function guardarManual(it: Item) {
    setMErr(null);
    const consumo = Number(mConsumo.replace(",", "."));
    if (!Number.isFinite(consumo) || consumo <= 0) {
      setMErr("Consumo no válido.");
      return;
    }
    setMSaving(true);
    try {
      const res = await fetch("/api/facturas/confirmar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          facturaId: it.facturaId,
          consumo,
          unidad: mUnidad,
          periodo_inicio: mIni,
          periodo_fin: mFin,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar");
      patch(it.key, {
        estado: "ok",
        detalle: `${mConsumo} ${mUnidad} · introducido a mano`,
        sConsumo: mConsumo,
        sUnidad: mUnidad,
        sIni: mIni,
        sFin: mFin,
      });
      setEditKey(null);
    } catch (err) {
      setMErr(err instanceof Error ? err.message : "Error");
    } finally {
      setMSaving(false);
    }
  }

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

  const facturasOk = items.filter((i) => i.estado === "ok" && i.facturaId);
  const listas = facturasOk.length;
  const trabajando = items.some((i) => i.estado === "subiendo" || i.estado === "extrayendo");

  async function generar() {
    setGenError(null);
    if (!cliente.trim()) {
      setGenError("Indica el nombre del cliente.");
      return;
    }
    if (facturasOk.length === 0) {
      setGenError("Sube al menos una factura leída correctamente.");
      return;
    }
    setGenerando(true);
    try {
      // 1. Create the recipient.
      const dRes = await fetch("/api/destinatarios", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nombre: cliente.trim() }),
      });
      const dJson = await dRes.json();
      if (!dRes.ok) throw new Error(dJson.error ?? "No se pudo crear el cliente");

      // 2. Generate the report from the OK bills (+ optional Scope 3 spend).
      const gastoNum = Number(gasto.replace(/[.\s]/g, "").replace(",", "."));
      const gastoValido = Number.isFinite(gastoNum) && gastoNum > 0;
      const gRes = await fetch("/api/informes/generar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destinatarioId: dJson.destinatario.id,
          facturaIds: facturasOk.map((f) => f.facturaId),
          ...(gastoValido ? { gastoAlcance3: gastoNum } : {}),
        }),
      });
      const gJson = await gRes.json();
      if (!gRes.ok) throw new Error(gJson.error ?? "No se pudo generar el informe");

      router.push(`/panel/informes/${gJson.informe.id}`);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Error al generar");
      setGenerando(false);
    }
  }

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
            {items.map((it) => {
              // Any uploaded bill can be edited/corrected by hand once it's no
              // longer mid-processing — including one already saved as "ok".
              const editable =
                !!it.facturaId && it.estado !== "subiendo" && it.estado !== "extrayendo";
              return (
                <div
                  key={it.key}
                  className="rounded-tl-[8px] rounded-tr-[4px] rounded-br-[9px] rounded-bl-[4px] border border-ink-muted/20 bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="m-0 truncate text-[14px] text-ink-text">{it.nombre}</p>
                      <p className="m-0 text-[12px] text-ink-muted">
                        {TIPOS.find((t) => t.value === it.tipo)?.label}
                        {it.detalle ? ` · ${it.detalle}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {editable && editKey !== it.key ? (
                        <button
                          onClick={() => abrirManual(it)}
                          className="font-mono text-[12px] text-sello hover:underline"
                        >
                          {it.estado === "ok" ? "Editar" : "Introducir a mano"}
                        </button>
                      ) : null}
                      <span
                        className={`rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] border px-2.5 py-1 font-mono text-[11px] ${BADGE[it.estado].cls}`}
                      >
                        {BADGE[it.estado].label}
                      </span>
                    </div>
                  </div>

                  {editKey === it.key ? (
                    <div className="mt-3 border-t border-ink-muted/15 pt-3">
                      <div className="flex flex-wrap gap-2">
                        <input
                          inputMode="decimal"
                          value={mConsumo}
                          onChange={(e) => setMConsumo(e.target.value)}
                          placeholder="Consumo"
                          className="w-[110px] rounded-[6px] border border-ink-muted/35 bg-white/[0.03] px-3 py-2 text-[13px] text-ink-text outline-none focus:border-sello"
                        />
                        <select
                          value={mUnidad}
                          onChange={(e) => setMUnidad(e.target.value as Unidad)}
                          className="rounded-[6px] border border-ink-muted/35 bg-white/[0.03] px-2 py-2 text-[13px] text-ink-text outline-none focus:border-sello"
                        >
                          <option value="kWh">kWh</option>
                          <option value="m3">m³</option>
                          <option value="litros">litros</option>
                        </select>
                        <input
                          type="date"
                          value={mIni}
                          onChange={(e) => setMIni(e.target.value)}
                          className="rounded-[6px] border border-ink-muted/35 bg-white/[0.03] px-3 py-2 text-[13px] text-ink-text outline-none focus:border-sello"
                        />
                        <input
                          type="date"
                          value={mFin}
                          onChange={(e) => setMFin(e.target.value)}
                          className="rounded-[6px] border border-ink-muted/35 bg-white/[0.03] px-3 py-2 text-[13px] text-ink-text outline-none focus:border-sello"
                        />
                        <button
                          onClick={() => guardarManual(it)}
                          disabled={mSaving}
                          className="rounded-[6px] bg-cta px-4 py-2 text-[13px] font-semibold text-paper-2 hover:bg-cta-hover disabled:opacity-50"
                        >
                          {mSaving ? "Guardando…" : "Guardar"}
                        </button>
                        <button
                          onClick={() => setEditKey(null)}
                          className="px-3 py-2 text-[13px] text-ink-muted hover:text-ink-text"
                        >
                          Cancelar
                        </button>
                      </div>
                      {mErr ? <p className="m-0 mt-2 text-[12.5px] text-error">{mErr}</p> : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Step 2 — recipient + generate */}
        <div className="border-t border-ink-muted/20 pt-7">
          <p className="m-0 mb-2 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase">
            Paso 2 de 2 · Para quién es
          </p>
          <h2 className="m-0 mb-1.5 font-serif text-[22px] font-semibold">Dinos el cliente</h2>
          <p className="m-0 mb-4 max-w-[60ch] text-[14px] leading-[1.55] text-[#C7CCC2]">
            El informe llevará el nombre de tu cliente (la empresa que te pidió la huella).
          </p>
          <div className="flex max-w-[480px] flex-col gap-3">
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nombre del cliente"
              className="w-full rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-ink-muted/35 bg-white/[0.03] px-3.5 py-2.5 text-[15px] text-ink-text outline-none placeholder:text-ink-muted focus:border-sello"
            />

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-ink-muted">
                Gasto anual en compras y servicios (opcional)
              </span>
              <div className="flex items-center gap-2">
                <input
                  inputMode="decimal"
                  value={gasto}
                  onChange={(e) => setGasto(e.target.value)}
                  placeholder="p. ej. 45000"
                  className="w-[160px] rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-ink-muted/35 bg-white/[0.03] px-3.5 py-2.5 text-[15px] text-ink-text outline-none placeholder:text-ink-muted focus:border-sello"
                />
                <span className="font-mono text-[13px] text-ink-muted">€ / año</span>
              </div>
              <span className="text-[12px] leading-[1.5] text-ink-muted">
                Si lo indicas, añadimos una <span className="text-ink-text">estimación de Alcance 3</span>{" "}
                (cadena de suministro) por método de gasto. Es una aproximación, no una medición. Déjalo
                vacío y el informe cubrirá solo Alcances 1 y 2.
              </span>
            </label>

            {genError ? <p className="m-0 text-[13px] text-error">{genError}</p> : null}
            <div className="flex items-center gap-4">
              <button
                onClick={generar}
                disabled={generando || trabajando || listas === 0}
                className="rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-cta px-[22px] py-3 text-[15px] font-semibold text-paper-2 hover:bg-cta-hover disabled:opacity-50"
              >
                {generando ? "Generando…" : "Generar informe"}
              </button>
              <span className="font-mono text-[12.5px] text-ink-muted">
                {listas} factura{listas === 1 ? "" : "s"} lista{listas === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
