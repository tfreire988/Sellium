"use client";

import { useState } from "react";

const MITECO_URL =
  "https://www.miteco.gob.es/es/cambio-climatico/temas/mitigacion-politicas-y-medidas/registro-huella.html";

function fmt(n: number | null): string {
  if (n == null) return "—";
  return `${n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 2 })} t CO2e`;
}

const PASOS = [
  "Entra en el registro de huella de carbono del MITECO y da de alta tu organización.",
  "Crea el cálculo del ejercicio correspondiente (Alcance 1 y 2 son obligatorios para el sello «Calculo»).",
  "Introduce las emisiones de Alcance 1 y Alcance 2 que tienes aquí abajo.",
  "Presenta la solicitud. Si se aprueba, obtienes el sello oficial «Calculo».",
];

/**
 * Turns the honest "we're not an official certificate, but we're the basis for
 * the MITECO registry" message into an action: hands the user the exact
 * figures the registry needs and the steps to self-register for the seal.
 */
export function RegistroMiteco({
  ejercicio,
  alcance1,
  alcance2,
  total,
}: {
  ejercicio: number;
  alcance1: number | null;
  alcance2: number | null;
  total: number;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    const texto = [
      `Huella de carbono · Ejercicio ${ejercicio}`,
      `Alcance 1 (combustión directa): ${fmt(alcance1)}`,
      `Alcance 2 (electricidad): ${fmt(alcance2)}`,
      `Total: ${fmt(total)}`,
      `Metodología: GHG Protocol · factores oficiales MITECO ${ejercicio}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <section className="mt-9 rounded-tl-[11px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] border border-ink-muted/25 bg-white/[0.02] px-6 py-6 dt:px-8 dt:py-7">
      <p className="m-0 mb-1.5 font-mono text-[10.5px] tracking-[1.8px] text-sello uppercase">
        Opcional · Sello oficial
      </p>
      <h2 className="m-0 mb-2 font-serif text-[22px] font-semibold text-ink-text dt:text-[26px]">
        Consigue el sello del MITECO
      </h2>
      <p className="m-0 mb-5 max-w-[62ch] text-[14px] leading-[1.6] text-[#C7CCC2] dt:text-[15px]">
        Este informe es tu autodeclaración, lista para tu cliente. Si además quieres
        el <span className="text-ink-text">sello oficial «Calculo»</span> del registro
        estatal, puedes inscribir estos mismos números tú mismo en el MITECO. Es
        gratuito y voluntario — nosotros te dejamos el cálculo hecho.
      </p>

      {/* Figures the registry needs */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <Figure label="Alcance 1" value={fmt(alcance1)} />
        <Figure label="Alcance 2" value={fmt(alcance2)} />
        <Figure label={`Total · ${ejercicio}`} value={fmt(total)} />
      </div>
      <button
        onClick={copiar}
        className="mb-6 rounded-tl-[6px] rounded-tr-[4px] rounded-br-[7px] rounded-bl-[4px] border border-ink-muted/45 px-3.5 py-2 font-mono text-[12.5px] text-ink-text hover:border-sello"
      >
        {copiado ? "✓ Copiado" : "Copiar los datos"}
      </button>

      {/* Steps */}
      <ol className="m-0 mb-6 flex list-none flex-col gap-3 p-0">
        {PASOS.map((paso, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-px shrink-0 font-mono text-[13px] font-semibold text-sello">
              {i + 1}
            </span>
            <span className="text-[13.5px] leading-[1.55] text-[#C7CCC2] dt:text-[14.5px]">
              {paso}
            </span>
          </li>
        ))}
      </ol>

      <a
        href={MITECO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] border border-ink-muted/45 px-[22px] py-3 text-[14.5px] font-semibold text-ink-text no-underline hover:border-sello hover:text-ink-text hover:no-underline"
      >
        Ir al registro del MITECO ↗
      </a>
      <p className="m-0 mt-4 max-w-[62ch] text-[12px] leading-[1.5] text-ink-muted">
        Nota: el sello «Calculo» acredita que has medido tu huella. Para licitaciones
        que exijan verificación acreditada (p. ej. AENOR) necesitarás además un
        verificador externo; este informe le sirve de base.
      </p>
    </section>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-ink-muted/20 px-3.5 py-3">
      <p className="m-0 mb-1 font-mono text-[10px] tracking-[1px] text-ink-muted uppercase">
        {label}
      </p>
      <p className="m-0 font-mono text-[15px] font-medium text-ink-text dt:text-[16px]">
        {value}
      </p>
    </div>
  );
}
