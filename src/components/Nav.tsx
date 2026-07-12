"use client";

import { useLanguage } from "@/lib/language-context";
import { copy } from "@/lib/copy";
import { LogoMark, Wordmark } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";

export function Nav() {
  const { lang } = useLanguage();
  const t = copy[lang].nav;

  return (
    <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-[18px] dt:px-14 dt:py-[26px]">
      <div className="flex items-center gap-[9px] dt:gap-3">
        <span className="dt:hidden">
          <LogoMark size={28} />
        </span>
        <span className="hidden dt:inline">
          <LogoMark size={34} />
        </span>
        <Wordmark className="text-[19px] dt:text-[22px] dt:tracking-[0.2px]" />
      </div>

      <div className="flex items-center gap-3 dt:gap-[34px]">
        <a href="#como-funciona" className="hidden text-[15px] text-ink-text no-underline dt:inline">
          {t.howItWorks}
        </a>
        <a href="#precios" className="hidden text-[15px] text-ink-text no-underline dt:inline">
          {t.pricing}
        </a>
        <a href="#gestorias" className="hidden text-[15px] text-ink-text no-underline dt:inline">
          {t.accountants}
        </a>

        <LanguageToggle small />

        <a
          href="#empezar"
          className="rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] bg-sello px-4 py-[9px] text-[13.5px] font-semibold text-ink no-underline hover:bg-sello-hover hover:text-ink hover:no-underline dt:px-[22px] dt:py-[11px] dt:text-[15px]"
        >
          {t.cta}
        </a>
      </div>
    </nav>
  );
}
