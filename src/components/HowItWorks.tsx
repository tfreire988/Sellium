"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";
import { NumberSeal } from "./NumberSeal";
import { InvoiceIcon } from "./InvoiceIcon";
import { MiniStamp } from "./MiniStamp";

/** Faint connector arrow shown between steps on desktop only. */
function Connector() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-[10px] -left-[26px] hidden font-mono text-[22px] text-ink-muted/50 dt:block"
    >
      →
    </span>
  );
}

export function HowItWorks() {
  const { lang } = useLanguage();
  const t = copy[lang].howItWorks;

  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-[1280px] px-5 pb-[60px] dt:px-14 dt:pb-[120px]"
    >
      <h2 className="m-0 mb-7 font-serif text-[32px] leading-none font-semibold dt:mb-14 dt:text-[64px]">
        {t.title}
      </h2>

      <div className="flex flex-col gap-6 dt:grid dt:grid-cols-[5fr_4fr_4fr] dt:items-start dt:gap-16">
        {/* Step 1 */}
        <div className="rounded-tl-[11px] rounded-tr-[5px] rounded-br-[9px] rounded-bl-[6px] bg-paper px-[22px] py-6 text-paper-text shadow-[0_12px_28px_rgba(15,10,4,0.4)] -rotate-[0.6deg] dt:px-8 dt:py-[34px] dt:shadow-[0_14px_34px_rgba(15,10,4,0.4)]">
          <div className="mb-3 flex items-center gap-3 dt:mb-[18px] dt:gap-3.5">
            <span className="dt:hidden">
              <NumberSeal size={38} number="1" />
            </span>
            <span className="hidden dt:inline">
              <NumberSeal size={46} number="1" />
            </span>
            <h3 className="m-0 font-serif text-[20px] font-semibold dt:text-2xl">
              {t.step1.title}
            </h3>
          </div>

          <p className="m-0 text-[14.5px] leading-[1.55] text-[#4A443A] dt:hidden">
            {t.step1.body}
          </p>
          <div className="hidden items-start gap-4 dt:flex">
            <InvoiceIcon />
            <p className="m-0 text-[15.5px] leading-[1.55] text-[#4A443A]">{t.step1.body}</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative dt:mt-[26px] dt:pt-2">
          <Connector />
          <div className="mb-2 flex items-center gap-2.5">
            <NumberSeal size={30} number="2" />
            <span className="font-mono text-[13px] text-ink-muted dt:text-[14px]">
              {t.step2.number}
            </span>
          </div>
          <h3 className="m-0 mb-2.5 font-serif text-[23px] leading-[1.15] font-semibold dt:mb-3.5 dt:text-[32px]">
            {t.step2.title}
          </h3>
          <p className="m-0 mb-4 text-[14.5px] leading-[1.55] text-[#C7CCC2] dt:text-[15.5px]">
            {t.step2.body}
          </p>
          {/* Recipient chip — makes "for whom" concrete */}
          <div className="flex w-fit items-center gap-2.5 rounded-tl-[8px] rounded-tr-[4px] rounded-br-[9px] rounded-bl-[4px] bg-paper px-3.5 py-2.5 text-paper-text shadow-[0_8px_20px_rgba(15,10,4,0.35)] -rotate-[0.5deg]">
            <span className="font-mono text-[10.5px] tracking-[1px] text-paper-muted uppercase">
              {t.step2.chipLabel}
            </span>
            <span className="text-[13px] font-medium dt:text-[13.5px]">
              {t.step2.chipValue}
            </span>
            <span className="font-semibold text-verificado">✓</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative dt:mt-[52px]">
          <Connector />
          <div className="mb-2.5 flex items-center gap-2.5 dt:mb-3">
            <NumberSeal size={30} number="3" />
            <span className="font-mono text-[13px] text-ink-muted dt:text-[14px]">
              {t.step3.number}
            </span>
          </div>
          <div className="relative mr-3.5 rounded-tl-[6px] rounded-tr-[10px] rounded-br-[5px] rounded-bl-[9px] bg-paper px-5 pt-[18px] pb-4 text-paper-text shadow-[0_12px_28px_rgba(15,10,4,0.4)] rotate-[0.8deg] dt:mr-0 dt:px-6 dt:pt-[22px] dt:pb-5 dt:shadow-[0_14px_34px_rgba(15,10,4,0.4)]">
            <p className="m-0 mb-2 font-mono text-[9.5px] tracking-[1px] text-paper-muted uppercase dt:mb-2.5 dt:text-[10.5px] dt:tracking-[1.5px]">
              {t.step3.filename}
            </p>
            <div className="flex items-baseline justify-between border-t-[1.5px] border-paper-text pt-2 dt:pt-2.5">
              <span className="text-[13px] font-semibold dt:text-[14px]">
                {t.step3.totalLabel}
              </span>
              <span className="font-mono text-[17px] font-medium dt:text-[19px]">
                {t.step3.totalValue}
              </span>
            </div>
            <div className="absolute -top-[18px] -right-3 -rotate-[11deg] dt:-top-[22px] dt:-right-4">
              <span className="dt:hidden">
                <MiniStamp size={60} word={t.step3.stampWord} variant="step" />
              </span>
              <span className="hidden dt:inline">
                <MiniStamp size={74} word={t.step3.stampWord} variant="step" />
              </span>
            </div>
          </div>
          <p className="m-0 mt-3.5 text-[14.5px] leading-[1.55] text-[#C7CCC2] dt:mt-[18px] dt:text-[15.5px]">
            {t.step3.body}
          </p>
        </div>
      </div>
    </section>
  );
}
