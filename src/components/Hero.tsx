"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";
import { HeroStamp } from "./HeroStamp";

export function Hero() {
  const { lang } = useLanguage();
  const t = copy[lang].hero;
  const r = t.report;

  return (
    <header className="mx-auto max-w-[1280px] px-5 pt-[26px] pb-[60px] dt:grid dt:grid-cols-[42fr_58fr] dt:items-center dt:gap-[60px] dt:px-14 dt:pt-[72px] dt:pb-[120px]">
      <div>
        <p className="m-0 mb-[14px] font-mono text-[11px] tracking-[2px] text-ink-muted uppercase dt:mb-[22px] dt:text-[13px] dt:tracking-[2.5px]">
          {t.eyebrow}
        </p>
        <h1 className="m-0 mb-4 text-pretty font-serif text-[33px] leading-[1.12] font-semibold dt:mb-6 dt:text-[56px] dt:leading-[1.08]">
          {t.title}
        </h1>
        <p className="m-0 mb-6 text-pretty text-[16px] leading-[1.55] text-[#C7CCC2] dt:mb-9 dt:max-w-[44ch] dt:text-[19px]">
          {t.subtitle}
        </p>

        <div className="mb-11 flex flex-col gap-3 dt:mb-0 dt:flex-row dt:items-center dt:gap-4">
          <Link
            id="empezar"
            href="/registro"
            className="block rounded-tl-[9px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] bg-cta py-[15px] text-center text-[16px] font-semibold text-paper-2 no-underline shadow-[0_10px_26px_rgba(120,70,20,0.35)] hover:bg-cta-hover hover:text-paper-2 hover:no-underline dt:px-7 dt:py-[15px] dt:text-[17px]"
          >
            {t.ctaPrimary}
          </Link>
          <a
            href="#como-funciona"
            className="block rounded-tl-[6px] rounded-tr-[9px] rounded-br-[5px] rounded-bl-[8px] border border-ink-muted/45 py-[13px] text-center text-[15px] text-ink-text no-underline hover:border-sello hover:text-ink-text hover:no-underline dt:px-[22px] dt:py-[14px] dt:text-[16px]"
          >
            {t.ctaSecondary}
          </a>
        </div>

        <p className="mt-[26px] hidden font-mono text-[12.5px] text-ink-muted dt:block">
          {t.tagline}
        </p>
      </div>

      {/* Document mock */}
      <div className="relative mx-[6px] mt-0 dt:mx-0 dt:mt-0 dt:w-full dt:max-w-[560px] dt:justify-self-end">
        <div className="absolute inset-[12px_-10px_-14px_14px] rounded-tl-[5px] rounded-tr-[12px] rounded-br-[6px] rounded-bl-[10px] bg-doc-shadow shadow-[0_18px_40px_rgba(15,10,4,0.5)] rotate-[1.2deg] dt:inset-[18px_-18px_-22px_24px] dt:shadow-[0_22px_50px_rgba(15,10,4,0.5)] dt:rotate-[1.1deg]" />
        <div className="relative rounded-tl-[12px] rounded-tr-[5px] rounded-br-[10px] rounded-bl-[6px] bg-paper px-[22px] pt-6 pb-[22px] text-paper-text shadow-[0_14px_34px_rgba(15,10,4,0.45)] -rotate-1 dt:px-[42px] dt:pt-[38px] dt:pb-[34px] dt:shadow-[0_18px_44px_rgba(15,10,4,0.45)]">
          <p className="m-0 mb-[5px] font-mono text-[10px] tracking-[1.5px] text-paper-muted uppercase dt:mb-[6px] dt:text-[12px] dt:tracking-[2px]">
            {r.label}
          </p>
          <p className="m-0 mb-[14px] font-serif text-[19px] font-semibold dt:mb-[22px] dt:text-[27px]">
            {r.client}
          </p>

          {/* Mobile structure: recipient row separate from scopes grid */}
          <div className="mb-2.5 flex items-baseline justify-between gap-3 border-t border-[#D8D0BC] pt-[13px] text-[13px] dt:hidden">
            <span>{r.recipientLabel}</span>
            <span className="font-mono text-[11px] font-medium">{r.recipientValue}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-y-[9px] text-[13px] dt:hidden">
            <span>{r.scope1Label}</span>
            <span className="font-mono font-medium">{r.scope1Value}</span>
            <span>{r.scope2Label}</span>
            <span className="font-mono font-medium">{r.scope2Value}</span>
            <span className="text-paper-muted">{r.scope3Label}</span>
            <span className="font-mono text-paper-muted">{r.scope3Value}</span>
          </div>

          {/* Desktop structure: recipient row merged into the same grid */}
          <div className="hidden grid-cols-[1fr_auto] gap-y-[13px] border-t border-[#D8D0BC] pt-5 text-[15.5px] dt:grid">
            <span>{r.recipientLabel}</span>
            <span className="font-mono text-[13px] font-medium">{r.recipientValue}</span>
            <span>{r.scope1Label}</span>
            <span className="font-mono font-medium">{r.scope1Value}</span>
            <span>{r.scope2Label}</span>
            <span className="font-mono font-medium">{r.scope2Value}</span>
            <span className="text-paper-muted">{r.scope3Label}</span>
            <span className="font-mono text-paper-muted">{r.scope3Value}</span>
          </div>

          <div className="mt-3 flex items-baseline justify-between border-t-2 border-paper-text pt-[10px] dt:mt-[18px] dt:pt-[14px]">
            <span className="text-[13.5px] font-semibold dt:text-[16px]">{r.totalLabel}</span>
            <span className="font-mono text-[20px] font-medium dt:text-[26px]">{r.totalValue}</span>
          </div>
          <p className="m-0 mt-3.5 font-mono text-[9.5px] text-paper-muted dt:mt-[22px] dt:text-[11.5px]">
            {r.footnote}
          </p>
        </div>

        <div className="absolute -top-[26px] -right-[14px] -rotate-[9deg] dt:-top-[34px] dt:-right-[30px]">
          <span className="dt:hidden">
            <HeroStamp
              size={108}
              ringText={t.stampRing}
              line1={t.stampLine1}
              line2={t.stampLine2}
              pathId="hero-ring-mobile"
            />
          </span>
          <span className="hidden dt:inline">
            <HeroStamp
              size={172}
              ringText={t.stampRing}
              line1={t.stampLine1}
              line2={t.stampLine2}
              pathId="hero-ring-desktop"
            />
          </span>
        </div>
      </div>
    </header>
  );
}
