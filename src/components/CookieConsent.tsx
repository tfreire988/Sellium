"use client";

import { useEffect, useState } from "react";
import { readConsent, saveConsent } from "@/lib/cookie-consent";

/**
 * RGPD/LSSI cookie banner: aceptar todas / rechazar / configurar.
 * Shown until the user makes a choice; the choice is stored client-side.
 * "Rechazar" is given the same visual weight as "Aceptar" (required — consent
 * must be as easy to refuse as to give).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState(false);
  const [analiticas, setAnaliticas] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Only decide visibility after mount — reading localStorage during render (or
  // in a lazy initializer) would mismatch the server-rendered HTML. Setting
  // state in this mount effect is the hydration-safe pattern here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  function decide(choice: { analiticas: boolean; marketing: boolean }) {
    saveConsent(choice);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4"
    >
      <div className="mx-auto max-w-[760px] rounded-tl-[12px] rounded-tr-[6px] rounded-br-[10px] rounded-bl-[7px] border border-ink-muted/25 bg-[#20291F] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.5)]">
        <p className="m-0 mb-1.5 font-serif text-[16px] font-semibold text-ink-text">
          Usamos cookies
        </p>
        <p className="m-0 mb-4 text-[13.5px] leading-[1.55] text-[#C7CCC2]">
          Usamos cookies necesarias para que el sitio funcione y, si lo aceptas,
          cookies analíticas para entender su uso. Puedes aceptarlas todas, rechazar
          las opcionales o elegir cuáles permites.{" "}
          <a href="#" className="text-link">
            Política de cookies
          </a>
          .
        </p>

        {config ? (
          <div className="mb-4 flex flex-col gap-2.5">
            <ConsentRow
              label="Necesarias"
              desc="Imprescindibles para iniciar sesión y usar el panel. Siempre activas."
              checked
              disabled
            />
            <ConsentRow
              label="Analíticas"
              desc="Nos ayudan a medir el uso del sitio de forma agregada."
              checked={analiticas}
              onChange={setAnaliticas}
            />
            <ConsentRow
              label="Marketing"
              desc="Para medir campañas. Desactivadas por defecto."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          {config ? (
            <button
              onClick={() => decide({ analiticas, marketing })}
              className="order-1 rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello px-5 py-2.5 text-[14px] font-semibold text-ink hover:bg-sello-hover"
            >
              Guardar selección
            </button>
          ) : (
            <>
              <button
                onClick={() => setConfig(true)}
                className="rounded-tl-[6px] rounded-tr-[9px] rounded-br-[5px] rounded-bl-[8px] border border-ink-muted/45 px-5 py-2.5 text-[14px] text-ink-text hover:border-sello"
              >
                Configurar
              </button>
              <button
                onClick={() => decide({ analiticas: false, marketing: false })}
                className="rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] border border-ink-muted/45 px-5 py-2.5 text-[14px] text-ink-text hover:border-sello"
              >
                Rechazar
              </button>
              <button
                onClick={() => decide({ analiticas: true, marketing: true })}
                className="rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello px-5 py-2.5 text-[14px] font-semibold text-ink hover:bg-sello-hover"
              >
                Aceptar todas
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] border border-ink-muted/20 px-3.5 py-2.5 ${
        disabled ? "opacity-70" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 accent-sello"
      />
      <span>
        <span className="block text-[13.5px] font-medium text-ink-text">{label}</span>
        <span className="block text-[12.5px] leading-[1.45] text-ink-muted">{desc}</span>
      </span>
    </label>
  );
}
