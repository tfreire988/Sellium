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
        <div className="mb-0 dt:mb-0">
          <h2 className="m-0 mb-3 font-serif text-[30px] leading-[1.1] font-semibold dt:mb-[18px] dt:text-[44px]">
            {t.title}
          </h2>
          <p className="m-0 mb-[26px] text-[15px] leading-[1.55] text-[#C7CCC2] dt:mb-0 dt:text-[16.5px]">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6 dt:grid dt:grid-cols-2 dt:items-start dt:gap-9">
          {/* Single report */}
          <div className="-rotate-[0.5deg] rounded-tl-[10px] rounded-tr-[5px] rounded-br-[11px] rounded-bl-[6px] bg-paper px-6 py-[26px] text-paper-text shadow-[0_12px_30px_rgba(15,10,4,0.42)] dt:px-8 dt:py-[34px] dt:shadow-[0_16px_38px_rgba(15,10,4,0.42)]">
            <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-paper-muted uppercase dt:mb-4 dt:text-[12px]">
              {t.single.label}
            </p>
            <p className="m-0 mb-[3px] font-mono text-[42px] font-medium dt:mb-1 dt:text-[54px]">
              {t.single.price}
            </p>
            <p className="m-0 mb-4 text-[13px] text-paper-muted dt:mb-[22px] dt:text-[14px]">
              {t.single.priceNote}
            </p>
            <ul className="m-0 mb-[18px] flex list-none flex-col gap-2 p-0 text-[14px] leading-[1.45] dt:mb-6 dt:gap-2.5 dt:text-[15px]">
              {t.single.features.map((f) => (
                <li key={f} className="relative pl-5 dt:pl-[22px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/registro"
              className="block rounded-tl-[8px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[5px] bg-sello py-[13px] text-center text-[15px] font-semibold text-ink no-underline hover:bg-sello-hover-2 hover:text-ink hover:no-underline dt:text-[16px]"
            >
              {t.single.cta}
            </Link>
            <p className="m-0 mt-3.5 text-[12.5px] leading-[1.45] text-paper-muted dt:mt-[18px] dt:text-[13px]">
              {t.single.roi}
            </p>
          </div>

          {/* Accountancy plan */}
          <div className="rotate-[0.5deg] rounded-tl-[5px] rounded-tr-[11px] rounded-br-[6px] rounded-bl-[10px] bg-paper px-6 py-[26px] text-paper-text shadow-[0_12px_30px_rgba(15,10,4,0.42)] dt:rotate-[0.6deg] dt:px-8 dt:py-[34px] dt:shadow-[0_16px_38px_rgba(15,10,4,0.42)] dt:mt-[22px]">
            <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-paper-muted uppercase dt:mb-4 dt:text-[12px]">
              {t.accountancy.label}
            </p>
            <p className="m-0 mb-[3px] dt:mb-1">
              <span className="font-mono text-[16px] text-paper-muted dt:text-[20px]">
                {t.accountancy.priceFrom}
              </span>{" "}
              <span className="font-mono text-[42px] font-medium dt:text-[54px]">
                {t.accountancy.price}
              </span>
              <span className="font-mono text-[16px] text-paper-muted dt:text-[20px]">
                {t.accountancy.pricePer}
              </span>
            </p>
            <p className="m-0 mb-4 text-[13px] text-paper-muted dt:mb-[22px] dt:text-[14px]">
              {t.accountancy.priceNote}
            </p>
            <ul className="m-0 mb-[18px] flex list-none flex-col gap-2 p-0 text-[14px] leading-[1.45] dt:mb-6 dt:gap-2.5 dt:text-[15px]">
              {t.accountancy.features.map((f) => (
                <li key={f} className="relative pl-5 dt:pl-[22px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/registro"
              className="block rounded-tl-[5px] rounded-tr-[9px] rounded-br-[5px] rounded-bl-[8px] border-[1.5px] border-paper-text py-3 text-center text-[15px] font-semibold text-paper-text no-underline hover:bg-paper-text hover:text-ink-text hover:no-underline dt:text-[16px]"
            >
              {t.accountancy.cta}
            </Link>
            <p className="m-0 mt-3.5 text-[12.5px] leading-[1.45] text-paper-muted dt:mt-[18px] dt:text-[13px]">
              {t.accountancy.roi}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
