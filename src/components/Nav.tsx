"use client";

import Link from "next/link";
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
        {/* On very narrow screens the seal alone carries the brand — the
            wordmark would collide with the actions on the right. */}
        <Wordmark className="hidden text-[19px] sm:inline dt:text-[22px] dt:tracking-[0.2px]" />
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

        <Link
          href="/login"
          className="text-[13.5px] text-ink-text no-underline dt:text-[15px]"
        >
          {t.login}
        </Link>

        <Link
          href="/registro"
          className="whitespace-nowrap rounded-tl-[7px] rounded-tr-[4px] rounded-br-[8px] rounded-bl-[4px] bg-cta px-3.5 py-[9px] text-[13px] font-semibold text-paper-2 no-underline hover:bg-cta-hover hover:text-paper-2 hover:no-underline dt:px-[22px] dt:py-[11px] dt:text-[15px]"
        >
          {t.cta}
        </Link>
      </div>
    </nav>
  );
}
