"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

function Check() {
  return <span className="absolute left-0 font-semibold text-verificado">✓</span>;
}

export function Pricing() {
  const { lang } = useLanguage();
  const t = copy[lang].pricing;

  return (
    <section
      id="precios"
      className="mx-auto max-w-[1280px] px-5 pb-16 dt:px-14 dt:pb-[130px]"
    >
      <div className="dt:grid dt:grid-cols-[30fr_70fr] dt:items-start dt:gap-[60px]">
        <div className="mb-7 dt:mb-0">
          <h2 className="m-0 mb-3 font-serif text-[30px] leading-[1.1] font-semibold dt:mb-[18px] dt:text-[44px]">
            {t.title}
          </h2>
          <p className="m-0 text-[15px] leading-[1.55] text-[#C7CCC2] dt:text-[16.5px]">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6 dt:grid dt:grid-cols-2 dt:items-stretch dt:gap-9">
          {/* Free (beta) plan — the live offer */}
          <div className="relative -rotate-[0.5deg] rounded-tl-[10px] rounded-tr-[5px] rounded-br-[11px] rounded-bl-[6px] bg-paper px-6 py-[26px] text-paper-text shadow-[0_12px_30px_rgba(15,10,4,0.42)] dt:px-8 dt:py-[34px] dt:shadow-[0_16px_38px_rgba(15,10,4,0.42)]">
            <span className="absolute -top-3 right-5 rotate-[2deg] rounded-tl-[6px] rounded-tr-[3px] rounded-br-[7px] rounded-bl-[3px] bg-cta px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[1.5px] text-paper-2 uppercase shadow-[0_4px_12px_rgba(15,10,4,0.3)]">
              {t.free.badge}
            </span>
            <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-paper-muted uppercase dt:mb-4 dt:text-[12px]">
              {t.free.label}
            </p>
            <p className="m-0 mb-[3px] font-mono text-[42px] font-medium dt:mb-1 dt:text-[54px]">
              {t.free.price}
            </p>
            <p className="m-0 mb-4 text-[13px] text-paper-muted dt:mb-[22px] dt:text-[14px]">
              {t.free.priceNote}
            </p>
            <ul className="m-0 mb-[18px] flex list-none flex-col gap-2 p-0 text-[14px] leading-[1.45] dt:mb-6 dt:gap-2.5 dt:text-[15px]">
              {t.free.features.map((f) => (
                <li key={f} className="relative pl-5 dt:pl-[22px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/registro"
              className="block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-cta py-[13px] text-center text-[15px] font-semibold text-paper-2 no-underline hover:bg-cta-hover hover:text-paper-2 hover:no-underline dt:text-[16px]"
            >
              {t.free.cta}
            </Link>
            <p className="m-0 mt-3.5 text-[12.5px] leading-[1.45] text-paper-muted dt:mt-[18px] dt:text-[13px]">
              {t.free.note}
            </p>
          </div>

          {/* Paid plans — coming soon */}
          <div className="relative flex flex-col rotate-[0.5deg] rounded-tl-[5px] rounded-tr-[11px] rounded-br-[6px] rounded-bl-[10px] border border-dashed border-ink-muted/40 bg-ink/40 px-6 py-[26px] dt:rotate-[0.6deg] dt:px-8 dt:py-[34px]">
            <div className="mb-4 flex items-center justify-between">
              <p className="m-0 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:text-[12px]">
                {t.paid.label}
              </p>
              <span className="rounded-tl-[6px] rounded-tr-[3px] rounded-br-[7px] rounded-bl-[3px] border border-ink-muted/45 px-2.5 py-1 font-mono text-[10px] tracking-[1px] text-ink-text uppercase">
                {t.paid.soon}
              </span>
            </div>
            <p className="m-0 mb-5 text-[14px] leading-[1.55] text-[#C7CCC2] dt:text-[15px]">
              {t.paid.body}
            </p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14px] leading-[1.45] text-ink-muted dt:text-[15px]">
              {t.paid.items.map((f) => (
                <li key={f} className="relative pl-5 dt:pl-[22px]">
                  <span className="absolute left-0 text-ink-muted">·</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
