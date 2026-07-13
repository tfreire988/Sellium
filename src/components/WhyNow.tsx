"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";

/**
 * "¿Por qué ahora?" — three reasons, deliberately NOT three identical cards.
 * Each gets a different typographic treatment and a different horizontal
 * position so the block reads as an editorial argument, not a feature grid.
 */
export function WhyNow() {
  const { lang } = useLanguage();
  const t = copy[lang].whyNow;
  const [r1, r2, r3] = t.reasons;

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-14 dt:px-14 dt:py-[110px]">
      <p className="m-0 mb-3 font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:text-[13px] dt:tracking-[2.5px]">
        {t.eyebrow}
      </p>
      <h2 className="text-pretty m-0 mb-10 max-w-[20ch] font-serif text-[30px] leading-[1.12] font-semibold dt:mb-16 dt:text-[52px] dt:leading-[1.08]">
        {t.title}
      </h2>

      <div className="flex flex-col gap-10 dt:gap-16">
        {/* Reason 1 — the headline argument: big, left, prominent */}
        <div className="dt:max-w-[62%]">
          <span className="mb-2 block font-mono text-[13px] text-sello dt:text-[15px]">01</span>
          <p className="text-pretty m-0 font-serif text-[23px] leading-[1.25] font-medium dt:text-[34px] dt:leading-[1.2]">
            {r1.lead}
          </p>
          <p className="m-0 mt-3 text-[15px] leading-[1.6] text-[#C7CCC2] dt:mt-4 dt:text-[17px]">
            {r1.body}
          </p>
        </div>

        {/* Reason 2 — offset to the right, quieter weight */}
        <div className="dt:ml-auto dt:max-w-[54%] dt:text-right">
          <span className="mb-2 block font-mono text-[13px] text-verificado dt:text-[15px]">02</span>
          <p className="text-pretty m-0 font-serif text-[21px] leading-[1.3] font-medium text-ink-text dt:text-[28px]">
            {r2.lead}
          </p>
          <p className="m-0 mt-3 text-[15px] leading-[1.6] text-[#C7CCC2] dt:text-[16px]">
            {r2.body}
          </p>
        </div>

        {/* Reason 3 — pulled-quote treatment with an accent rule */}
        <div className="dt:max-w-[58%] dt:ml-[8%] border-l-2 border-sello pl-5 dt:pl-7">
          <span className="mb-2 block font-mono text-[13px] text-sello dt:text-[15px]">03</span>
          <p className="text-pretty m-0 font-serif text-[20px] leading-[1.3] font-medium dt:text-[26px]">
            {r3.lead}
          </p>
          <p className="m-0 mt-3 text-[15px] leading-[1.6] text-[#C7CCC2] dt:text-[16px]">
            {r3.body}
          </p>
        </div>
      </div>
    </section>
  );
}
