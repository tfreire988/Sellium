"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

const STATUS_STYLE: Record<string, string> = {
  ENVIADO: "text-sello border-sello",
  SENT: "text-sello border-sello",
  LISTO: "text-verificado border-verificado",
  READY: "text-verificado border-verificado",
  BORRADOR: "text-paper-muted border-[#C4BCA8]",
  DRAFT: "text-paper-muted border-[#C4BCA8]",
};

export function Accountants() {
  const { lang } = useLanguage();
  const t = copy[lang].accountants;

  return (
    <section id="gestorias" className="bg-paper text-paper-text">
      <div className="mx-auto max-w-[1280px] px-5 py-[52px] dt:grid dt:grid-cols-[55fr_45fr] dt:items-center dt:gap-[70px] dt:px-14 dt:py-[100px]">
        <div>
          <p className="m-0 mb-3.5 font-mono text-[11px] tracking-[2px] text-paper-muted uppercase dt:mb-5 dt:text-[13px] dt:tracking-[2.5px]">
            {t.eyebrow}
          </p>
          <h2 className="text-pretty m-0 mb-3.5 font-serif text-[27px] leading-[1.15] font-semibold dt:mb-[22px] dt:text-[46px] dt:leading-[1.1]">
            {t.title}
          </h2>
          <p className="m-0 mb-6 text-[15px] leading-[1.6] text-[#4A443A] dt:mb-4 dt:max-w-[52ch] dt:text-[17px]">
            {t.body}
          </p>

          <a
            href="#precios"
            className="hidden dt:mt-3 dt:inline-block dt:rounded-tl-[8px] dt:rounded-tr-[5px] dt:rounded-br-[9px] dt:rounded-bl-[5px] dt:bg-paper-text dt:px-[26px] dt:py-3.5 dt:text-[16px] dt:font-semibold dt:text-ink-text dt:no-underline dt:hover:bg-[#3A342A] dt:hover:text-ink-text dt:hover:no-underline"
          >
            {t.cta}
          </a>
        </div>

        <div className="mb-6 rotate-[0.5deg] rounded-tl-[9px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] border border-paper-border bg-paper-2 px-5 py-[18px] shadow-[0_12px_26px_rgba(60,45,20,0.18)] dt:mb-0 dt:px-7 dt:py-[26px] dt:shadow-[0_14px_32px_rgba(60,45,20,0.18)]">
          <p className="m-0 mb-3 font-mono text-[10px] tracking-[1.5px] text-paper-muted uppercase dt:mb-[18px] dt:text-[11.5px] dt:tracking-[1.8px]">
            {t.panelLabel}
          </p>
          <div className="flex flex-col">
            {t.rows.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between border-t border-paper-row py-2.5 dt:py-3"
              >
                <span className="text-[13.5px] font-medium dt:text-[15px]">{row.name}</span>
                <span
                  className={`rounded-tl-[5px] rounded-tr-[3px] rounded-br-[6px] rounded-bl-[3px] border px-2 py-0.5 font-mono text-[10.5px] dt:px-2.5 dt:py-[3px] dt:text-[12px] ${STATUS_STYLE[row.status]}`}
                >
                  {row.status}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-b border-paper-row py-2.5 dt:py-3">
              <span className="text-[13.5px] font-medium text-paper-muted dt:text-[15px]">
                {t.pendingClient}
              </span>
              <span className="text-[12px] font-medium text-sello dt:text-[13px]">{t.request}</span>
            </div>
          </div>
        </div>

        <a
          href="#precios"
          className="block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-paper-text py-3.5 text-center text-[15px] font-semibold text-ink-text no-underline hover:bg-[#3A342A] hover:text-ink-text hover:no-underline dt:hidden"
        >
          {t.cta}
        </a>
      </div>
    </section>
  );
}
